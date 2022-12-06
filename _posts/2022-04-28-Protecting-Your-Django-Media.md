---
layout: post
title: Protecting Your Django Media
tags: [django, media, protect, nginx, x-accel, X-Sendfile]
---

Typically with your Django site, you would leave it up to your web server to serve up your user generated media files, as recommended by the docs. And this would be fine for a small site where user's posts can be seen by everyone and there is no need to hide your media. However, what about if your users only wanted to share their uploaded photo with a select few? How about logging in a database whenever an asset is accessed? Or just hiding your servers internal paths? There are many reasons you may want a media request to go through your code, rather than being served straight from the web server. This has been one of the challenges I have hit while working on [Shifter](https://github.com/TobySuch/Shifter). Luckily for us, all the major HTTP servers (Apache, NGINX etc.) have a nifty way of handling requests like this, and it isn't much more work to set up!

The feature is commonly known as `X-Sendfile` although NGINX calls it `X-accel` and as that's the tool I have been playing with recently, I'll refer to it as that from now on. X-accel allows you to internally redirect one request to a different location, completely transparent to the user. This is different from a normal alias, as it allows your backend to first handle authentication, logging and whatever else you like, before going back to the web server and letting it do what it does best: serve content. This prevents Django (or whatever backend you are using) from getting bogged down with serving large files, something it isn't particularly good at, compared to NGINX.

Now you might think you don't need to worry about this. If you are only serving static css and javascript then you probably don't. Even if someone got access to the CSS for your admin site, they still have no access to read or write anything sensitive. But once you start serving media files which are not for all eyes, you run into an issue. The link may be protected behind your authentication, but if someone was to get access to it either by mistake or malicious intent, there is no way to close that can of worms. A users private photo that they shared to everyone by accident can not be made private without physically moving the file path. Now that is possible to do, but it breaks the path that everyone else has and now they must reload to get the new one. Logging and metrics become harder as each asset may have 2, 3 or even more different paths for the same thing as every time the permissions change, so too must the path. X-accel fixes this.

## So How Does It Work?
Let's take what could be a standard `nginx.conf` for Django:
```
server {
    listen 80;

    location / {
        proxy_pass http://mysite;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $host;
        proxy_redirect off;
    }

    location /static/ {
        alias /home/app/web/static/;
    }

    location /media {
        alias /home/app/web/media;
    }
}
```

Right now, the media is unprotected. Any requests that come in for a media file will automatically be handled by NGINX, serving the file from disk before Django ever gets a chance to have a say. We will come back to the `nginx.conf`, but lets take a look at an example Django view.

{% highlight python %}
# URL
path('download/<str:file_id>', views.FileDownloadView.as_view(),
     name='file-download')

...

# View
class FileDownloadView(TemplateView):
    template_name = "myapp/file-download.html"
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        file_obj = get_object_or_404(MyFileModel, id=kwargs["file_id"])
        context["file_path"] = file_obj.filefield.url
        return context
{% endhighlight %}

This view would allow you to have a button which when selected would redirect the user straight to the media directory, unprotected. How can we do better? Well as alluded to before, using the `X-accel` feature built into NGINX.

In order to take advantage of this, we need our view to return a specific header. Specifically the `X-Accel-Redirect` one. The rest of the response does not matter, as NGINX will replace the body. The header should be set to the path of the media asset we would like to return. Instead of using our view above, we could use something like the following:
{% highlight python %}
class FileDownloadView(View):
    def setup(self, request, *args, **kwargs):
        self.file_obj = get_object_or_404(MyFileModel, file_id=kwargs["file_id"])
        return super().setup(request, args, kwargs)

    def get(self, request, *args, **kwargs):
        response = HttpResponse()
        response['X-Accel-Redirect'] = self.file_obj.filefield.url
        return response
{% endhighlight %}

Now assuming the URL that is fed into the header starts with `/media`, NGINX will automatically replace the body of the request with the file it finds at `/home/app/web/media/<rest of path>`, all while the user has no idea it is happening behind the scenes. In our example above, we aren't actually protecting anything as any request can be passed through. However, you can easily add in `LoginRequiredMixin`, or your own log messages or database access to the view to handle it however you like.

## Locking Down NGINX

There is a couple more things to notice however. Even though the user has no need to make a request directly to `/media`, it is still open to the web. Someone could in theory brute force their way to your assets, something which could be very easy depending on your naming convention. It is an easy thing to fix though, by simply adding `internal;` to configuration:
```
server {
    listen 80;

    location / {
        proxy_pass http://mysite;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $host;
        proxy_redirect off;
    }

    location /static/ {
        alias /home/app/web/static/;
    }

    location /media {
        internal;
        alias /home/app/web/media;
    }
}
```
This now means that the location will no longer match if the request comes from the internet, but will match if it comes from inside the network. It will also match anything returned with the `X-accel-redirect` header.

## Setting The File Name
One final problem to overcome is setting the file name. Currently, the file will default to having the name of the last part of the path used to make the original request. It will have nothing to do with what is returned in the `X-accel-redirect` header. Using the example URL path above, the URL `/download/12345` will return a file called `12345`. Notice there is no file extension here so your computer won't know how to handle it. 

There are a few ways to fix this, and I think the easiest is to set another header with the title, although this may not be the best method depending on your use case. We can use the `Content-Disposition` header to set some information about what we are returning.
{% highlight python %}
class FileDownloadView(View):
    def setup(self, request, *args, **kwargs):
        self.file_obj = get_object_or_404(MyFileModel, file_id=kwargs["file_id"])
        return super().setup(request, args, kwargs)

    def get(self, request, *args, **kwargs):
        response = HttpResponse()
        response['X-Accel-Redirect'] = self.file_obj.filefield.url
        response['Content-Disposition'] = ('attachment; filename='
                                           f'"{self.file_obj.filefield.name}"')
        return response
{% endhighlight %}
Note: you may need to di some string mangling if you are saving it within subfolders. You can get just the filename using `os.path.basename(self.file_obj.filefield.name)`

## I Did This And Now My Development Environment Is Broken!
An unfortunate side effect of this is that now you are completely reliant on NGINX to serve your media files, even in development. The quickest way I think to solve this issue is simply to check whether you are in debug mode, and if so serve the request like before.
{% highlight python %}
class FileDownloadView(View):
    def setup(self, request, *args, **kwargs):
        self.file_obj = get_object_or_404(MyFileModel, file_id=kwargs["file_id"])
        return super().setup(request, args, kwargs)

    def get(self, request, *args, **kwargs):
        if settings.DEBUG:
            return HttpResponseRedirect(self.obj.file_content.url)
        response = HttpResponse()
        response['X-Accel-Redirect'] = self.file_obj.filefield.url
        response['Content-Disposition'] = ('attachment; filename='
                                           f'"{self.file_obj.filefield.name}"')
        return response
{% endhighlight %}
This will just redirect the user to the `/media` path which will be fine as there is no NGINX server to block it, and instead it will be served by Django's development server. Obviously this is reliant on you turning debug mode off before deploying your server.
from django.contrib import admin
from .models import User, ImdIds, PlayList
# Register your models here.
admin.site.register(User)
admin.site.register(ImdIds)
admin.site.register(PlayList)
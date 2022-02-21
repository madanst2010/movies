from unicodedata import name
from django.urls import include, path
from .views import AddOrRemoveItem, CheckEmail, CheckUsername, GetSelfPlayListAndMovies, LoginView, MovieView, OtpView, PlayListView, PublicPlayLists
urlpatterns = [
    path('', MovieView.as_view(), name='movie_view'),
    path('otp', OtpView.as_view(), name='otp_view'),
    path('check-user', CheckUsername.as_view(), name='check_user_view'),
    path('check-email', CheckEmail.as_view(), name='check_email_view'),
    path('login', LoginView.as_view(), name='login_view'),
    path('play-list', PlayListView.as_view(), name='play_list_view'),
    path('movie', AddOrRemoveItem.as_view(), name="add_remove_view"),
    path('self-playlist',GetSelfPlayListAndMovies.as_view(), name="get_self_view"),
    path('public-playlist',PublicPlayLists.as_view(), name="public_view"),
]

from email import message
from functools import partial
from os import stat
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.models import AbstractBaseUser
from datetime import datetime
import base64
import pyotp
from django.conf import settings
from django.core.mail import send_mail
from .models import ImdIds, PlayList, User
from .serializer import ImdIdsSerilizer, LoginSerializer, PlayListSerilizer, UserSerializer
from django.contrib.auth.hashers import make_password, check_password
from rest_framework.permissions import IsAuthenticated
# Create your views here.
class generateKey:
    @staticmethod
    def returnValue(phone):
        return str(phone) + str(datetime.date(datetime.now())) + "Some Random Secret Key"
class MovieView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        return Response("okkkk", status=200)

class CheckEmail(APIView):
    def post(self, request):
        email = request.data['email']
        try:
            user = User.objects.get(email=email)
            return Response("This is email already exits", status=409)
        except User.DoesNotExist:
            return Response(status=200)
class CheckUsername(APIView):
    def post(self, request):
        username = request.data['username']
        try:
            user = User.objects.get(username=username)
            return Response("user already exits", status=409)
        except User.DoesNotExist:
            return Response(status=200)
class OtpView(APIView):
    def get(self, request):
        print(request.data, "dataaaaaaaaaaaaaaaaaa")
        email = request.data['email']
        keygen = generateKey()
        key = base64.b32encode(keygen.returnValue(email).encode())
        OTP = pyotp.TOTP(key, interval=300)
        subject = "OTP to Sign Up On Movie app"
        message = "Your OTP for singing up on Movie app is " + OTP.now() + ". The code will be valid for 5 minutes only."
        email_from = settings.EMAIL_HOST_USER
        recipient = [email,]
        send_mail(subject, message, email_from, recipient)
        print(OTP.now())
        return Response(OTP.now())
    def post(self, request):
        if 'get' in request.data:
            email = request.data['email']
            keygen = generateKey()
            key = base64.b32encode(keygen.returnValue(email).encode())
            OTP = pyotp.TOTP(key, interval=300)
            subject = "OTP to Sign Up On Movie app"
            message = "Your OTP for singing up on Movie app is " + OTP.now() + ". The code will be valid for 5 minutes only."
            email_from = settings.EMAIL_HOST_USER
            recipient = [email,]
            send_mail(subject, message, email_from, recipient)
            print(OTP.now())
            return Response("Otp Sent Successfully on email "+ email, status = 200 )
        otp = request.data['otp']
        email = request.data['email']
        keygen = generateKey()
        key = base64.b32encode(keygen.returnValue(email).encode())
        OTP = pyotp.TOTP(key, interval=300)
        if OTP.verify(otp):
            print("veryfied")
            serializer = UserSerializer(data=request.data)
            print(request.data)
            if serializer.is_valid():
                serializer.validated_data['password'] = make_password(serializer.validated_data['password'])
                serializer.save()
                return Response("User Created Successfully", status = 201)
            return Response(serializer.errors, status=400)
        return Response("worng otp entered", status = 400)

class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            try:
                obj = User.objects.get(username=request.data['username'])
                if obj.check_password(request.data['password']):
                    return Response("Successfully Logged in", status = 200)
                else:
                    return Response("Wrong username or password entered", status = 403)
            except User.DoesNotExist:
                return Response("Wrong username or password entered", status = 403)
        return Response(serializer.errors, status=400)


class PlayListView(APIView):
    def post(self, request):
        if not request.user.is_authenticated:
            return Response("User is not authenticated", status = 403)
        user = request.user
        user = User.objects.get(id=user.id)
        request.data['user']=user.id
        playlist = PlayListSerilizer(data=request.data)
        if playlist.is_valid():
            playlist = playlist.save()
            return Response("Data Saved successfully", status = 201)
        return Response(playlist.errors, status=400)
    def put(self, request):
        if not request.user.is_authenticated:
            return Response("User is not authenticated", status = 403)
        id = request.GET.get('id')
        user = request.user
        user = User.objects.get(id=user.id)
        if id:
            try:
                obj = PlayList.objects.get(id=id,user__id=user.id)
                serilizer = PlayListSerilizer(obj, request.data, partial=True)
                if serilizer.is_valid():
                    serilizer.save()
                    return Response("Data Updated successfully", status = 204)
                return Response(serilizer.errors, status=400)
            except PlayList.DoesNotExist:
                return Response("No playlist found or you don't have access", status = 400)
        return Response("Please give id", status=400)
    def delete(self, request):
        if not request.user.is_authenticated:
            return Response("User is not authenticated", status = 403)
        id = request.GET.get('id')
        user = request.user
        user = User.objects.get(id=user.id)
        if id:
            try:
                obj = PlayList.objects.get(id=id,user__id=user.id)
                obj.delete()
                return Response("Data deleted successfully", status = 204)
            except PlayList.DoesNotExist:
                return Response("No playlist found or you don't have access", status = 400)
        return Response("Please give id", status=400)
        
class AddOrRemoveItem(APIView):
    def post(self, request):
        if not request.user.is_authenticated:
            return Response("User is not authenticated", status = 403)
        user = request.user
        user = User.objects.get(id=user.id)
        id = request.GET.get('id')
        if id:
            try:
                playlist = PlayList.objects.get(id=id,user__id=user.id)
                request.data['playlist']=playlist.id
                serializer = ImdIdsSerilizer(data=request.data)
                movieId = serializer.initial_data['imdbID']
                obj = ImdIds.objects.filter(imdbID=movieId,playlist=playlist.id)
                if obj:
                    return Response("This movie is already added in playlist", status=400)
                if serializer.is_valid():
                    serializer.save()
                    return Response("Data added successfully", status = 204)
                return Response(serializer.errors, status=400)
            except PlayList.DoesNotExist:
                return Response("No playlist found or you don't have access", status = 400)
        return Response("Please give id", status=400)
    def delete(self, request):
        if not request.user.is_authenticated:
            return Response("User is not authenticated", status = 403)
        id = request.GET.get('id')
        imdbID = request.GET.get('imdbID')
        user = request.user
        user = User.objects.get(id=user.id)
        if id and imdbID:
            try:
                playlist = PlayList.objects.get(id=id,user__id=user.id)
                try:
                    obj = ImdIds.objects.get(id=imdbID,playlist=playlist.id)
                    obj.delete()
                    return Response("Data deleted successfully", status = 204)
                except ImdIds.DoesNotExist:
                    return Response("No Moive found", status = 400)
            except PlayList.DoesNotExist:
                return Response("No playlist found or you don't have access", status = 400)
        return Response("Please give playlist id and movie id", status=400)
        
class GetSelfPlayListAndMovies(APIView):
    def get(self, request):
        if not request.user.is_authenticated:
            return Response("User is not authenticated", status = 403)
        user = request.user
        try:

            user = User.objects.get(id=user.id)
            playlists = PlayList.objects.filter(user__id=user.id)
            ply = playlists
            playlists = list(playlists.values())
            for playlist in playlists:
                movieId = ImdIds.objects.filter(playlist_id=playlist['id'])
                playlist['movieId'] = movieId.values('imdbID', 'id')
            return Response(playlists, status = 200)
        except User.DoesNotExist:
            Response("User doesn't exits", status = 400)
class PublicPlayLists(APIView):
    def get(self, request):
        noid = ""
        if request.user.is_authenticated:
            user = request.user
            user = User.objects.get(id=user.id)
            noid = user.id
        user = request.user
        users = User.objects.all()
        users = list(users.values())
        final_playlist = []
        for user in users:
            if user['id'] == noid:
                continue
            playlists = PlayList.objects.filter(user__id=user['id'], public=True)
            playlists = list(playlists.values())
            for playlist in playlists:
                movieId = ImdIds.objects.filter(playlist_id=playlist['id'])
                playlist['movieId'] = movieId.values('imdbID')
                playlist['user'] = user['username']
            tempPlaylist = []
            for playlist in playlists:
                if len(playlist["movieId"]) > 0:
                    del playlist["user_id"]
                    del playlist["public"]
                    tempPlaylist.append(playlist)
            if len(tempPlaylist) > 0:
                final_playlist.append(tempPlaylist)
        return Response(final_playlist, status = 200)
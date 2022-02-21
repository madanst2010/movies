from dataclasses import fields
import imp
from pyexpat import model
from rest_framework import serializers
from .models import User, PlayList, ImdIds

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User 
        fields = ['username', 'password', 'email']
    
class LoginSerializer(serializers.Serializer):
    class Meta:
        model = User
        fields = ['username', 'password']

class PlayListSerilizer(serializers.ModelSerializer):
    class Meta: 
        model = PlayList
        fields = ['name', 'user', 'public']
class ImdIdsSerilizer(serializers.ModelSerializer):
    class Meta: 
        model = ImdIds
        fields = '__all__'

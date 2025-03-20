from rest_framework import serializers
from .models import Note,Folder

class NoteSerializer(serializers.ModelSerializer):
    folder_name = serializers.CharField(write_only=True, required=False)  
    folder = serializers.PrimaryKeyRelatedField(queryset=Folder.objects.all(), required=False)

    class Meta:
        model = Note
        fields = ["id", "title", "content", "summary", "pdf_file", "folder", "folder_name", "created_at"]

    def create(self, validated_data):
        folder_name = validated_data.pop("folder_name", None)
        user = self.context["request"].user  

        if folder_name:
            folder = Folder.objects.filter(name=folder_name, user=user).first()
            if not folder:
                raise serializers.ValidationError({"folder_name": "Folder not found"})
            validated_data["folder"] = folder  

        return super().create(validated_data)



class FolderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Folder
        fields=['id','name','user','created_at']
        read_only_fields = ['user','created_at']        
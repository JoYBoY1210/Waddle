from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Note,Folder
from .serializers import NoteSerializer,FolderSerializer
from rest_framework import status
from rest_framework.permissions import IsAuthenticated,AllowAny
from django.shortcuts import get_object_or_404
import fitz
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from .utils import summarize_text
import json
from rest_framework.parsers import MultiPartParser

# Create your views here.
class FolderListView(APIView):
    permission_classes=[IsAuthenticated]

    def get(self,request):
        folders=Folder.objects.filter(user=request.user)
        folder_data=[]
        for folder in folders:
            notes=Note.objects.filter(folder=folder)
            folder_data.append({
                "id":folder.id,
                "name":folder.name,
                "notes":NoteSerializer(notes, many=True).data
            })
        
        return Response(folder_data,status=status.HTTP_200_OK)
    
class FolderCreateView(APIView):

    permission_classes=[IsAuthenticated]

    def post(self,request):
        serializer=FolderSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)    
    
class FolderDetailView(APIView):
    permission_classes=[IsAuthenticated]

    def get(self,request,pk):
        try:
            folder=Folder.objects.get(id=pk,user=request.user)
            serializer=FolderSerializer(folder)
            return Response(serializer.data,status=status.HTTP_200_OK)
        except Folder.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    def put(self,request,pk):
        try:
            folder=Folder.objects.get(id=pk,user=request.user)
            serializer=FolderSerializer(folder,data=request.data,partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data,status=status.HTTP_200_OK)
            return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
        except Folder.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    def delete(self,request,pk):
        try:
            
            folder=Folder.objects.get(id=pk,user=request.user)
            folder.delete()
            return Response({"message":"folder deleted successfully"},status=status.HTTP_204_NO_CONTENT)
        except Folder.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)       


class NoteListView(APIView):
    permission_classes=[IsAuthenticated]

    def get(self,request):
        notes=Note.objects.filter(user=request.user)
        serializer=NoteSerializer(notes,many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)
    

class NoteCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = NoteSerializer(data=request.data, context={"request": request})  
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class NoteDetailView(APIView):
    permission_classes=[IsAuthenticated]

    def get(self,request,pk):
        try:
            note=Note.objects.get(id=pk,user=request.user)
            serializer=NoteSerializer(note)
            return Response(serializer.data,status=status.HTTP_200_OK)
        except Note.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    def put(self,request,pk):
        try:
            note=Note.objects.get(id=pk,user=request.user)
            serializer=NoteSerializer(note,data=request.data,partial=True)
            if serializer.is_valid():
                serializer.save();
                return Response(serializer.data,status=status.HTTP_200_OK)
            return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
        except Note.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    def delete(self,request,pk):
        try:
            note=Note.objects.get(id=pk,user=request.user)
            note.delete()
            return Response({"message":"note deleted successfully"},status=status.HTTP_204_NO_CONTENT)
        except Note.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)       




class UploadPDFView(APIView):
    parser_classes = [MultiPartParser]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        uploadedFile = request.FILES.get("pdf_file")
        print(uploadedFile)
        min_length = request.data.get("min_length", 50)
        max_length = request.data.get("max_length", 200)

        if not uploadedFile:
            return Response({"error": "No PDF file uploaded"}, status=status.HTTP_400_BAD_REQUEST)

        
        pdf_path = default_storage.save(f"notes_pdfs/{uploadedFile.name}", uploadedFile)

        
        extracted_text = self.extract_text_from_pdf(default_storage.path(pdf_path))

       
        extracted_text = extracted_text.encode("utf-8", "ignore").decode("utf-8")

        print("Extracted Text:", extracted_text)

        
        summary = summarize_text(extracted_text, int(min_length), int(max_length))

        response_data = {
            "pdf_file": pdf_path,
            "extracted_text": extracted_text,
            "summary_text": summary
        }

        try:
            json.dumps(response_data)  # Ensure it's JSON serializable
        except Exception as e:
            return Response({"error": f"JSON serialization error: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(response_data, status=status.HTTP_200_OK)

    def extract_text_from_pdf(self, pdf_path):
        text = ""
        with fitz.open(pdf_path) as doc:
            for page in doc:
                page_text = page.get_text("text")
            
                page_text = page_text.encode("utf-8", "ignore").decode("utf-8", "ignore")
                text += page_text + "\n"

        return text
 



class SaveNote(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        title = request.data.get("title")
        extracted_text = request.data.get("extracted_text")
        summary_text = request.data.get("summary_text", "")
        folder_id = request.data.get("folder_id", None)
        folder_name = request.data.get("folder_name", None)
        pdf_path = request.data.get("pdf_path")

        if not extracted_text:
            return Response({"error": "Extracted text is required"}, status=status.HTTP_400_BAD_REQUEST)

        folder = None
        if folder_id:
            folder = get_object_or_404(Folder, id=folder_id, user=user)
        elif folder_name:
            folder = Folder.objects.filter(name=folder_name, user=user).first()
            if not folder:
                return Response({"error": "Folder not found"}, status=status.HTTP_404_NOT_FOUND)

        note = Note.objects.create(
            user=user,
            title=title,
            folder=folder,
            content=extracted_text,
            summary=summary_text,
            pdf_file=pdf_path
        )

        return Response(NoteSerializer(note).data, status=status.HTTP_201_CREATED)
    


class sumarizeInputTextView(APIView):
    
    def post(self,request):
        text=request.data.get("text")
        summary_length=request.data.get("summary_length",50)
        if not text:
            return Response({"error":"text is required"},status=status.HTTP_400_BAD_REQUEST)

        summary=summarize_text(text,int(summary_length))
        return Response({"original_text":text,"summary_text":summary},status=status.HTTP_200_OK)
    

class saveManualNoteView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        title = request.data.get("title")
        content = request.data.get("content")
        summary = request.data.get("summary")
        folder_id = request.data.get("folder_id",None)
        folder_name = request.data.get("folder_name", None)

        if not title or not content or not summary:
            return Response({"error": "Title, content, and summary are required"}, status=400)

        folder = None
        if folder_id:
            try:
                folder = Folder.objects.get(id=folder_id, user=user)
            except Folder.DoesNotExist:
                return Response({"error": "Folder not found"}, status=404)
        elif folder_name:
            folder = Folder.objects.filter(name=folder_name, user=user).first()
            if not folder:
                return Response({"error": "Folder not found"}, status=404)

        note = Note.objects.create(
            user=user,
            title=title,
            content=content,
            summary=summary,
            folder=folder
        )

        return Response(NoteSerializer(note).data, status=201)
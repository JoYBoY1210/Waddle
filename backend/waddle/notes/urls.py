from django.urls import path
from . import views

urlpatterns = [
    path('folders/',views.FolderListView.as_view(),name='folders-list'),
    path('folders/create/',views.FolderCreateView.as_view(),name='folders-create'),
    path('folders/<int:pk>/',views.FolderDetailView.as_view(),name='folders-detail'),
    path('notes/',views.NoteListView.as_view(),name='notes-list'),
    path('notes/create/',views.NoteCreateView.as_view(),name='notes-create'),
    path('notes/<int:pk>/',views.NoteDetailView.as_view(),name='notes-detail'),
    path('pdf/upload/',views.UploadPDFView.as_view(),name='pdf-upload'),
    path('saveAsNote/',views.SaveNote.as_view(),name='save-as-note'),
    path('sumarrizeInputText/',views.sumarizeInputTextView.as_view(),name='summarize-input-text'),
    path("saveManualNote/", views.saveManualNoteView.as_view(), name="save-manual-note"),


]

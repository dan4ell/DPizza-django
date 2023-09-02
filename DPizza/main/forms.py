from .models import Reviews
from django import forms


class CustomTextInput(forms.widgets.TextInput):
    def __init__(self, attrs=None):
        if attrs is not None:
            attrs['type'] = ''
        super().__init__(attrs)
class ReviewsForm(forms.ModelForm):
    class Meta:
        model = Reviews
        fields = ('number', 'name', 'review' )
        widgets = {
            'number': CustomTextInput(attrs={'class': 'review-item', 'id': 'phone_1'}),
            'name': forms.TextInput(attrs={'class': 'review-item', 'placeholder': 'Иван Иванов'}),
            'review': forms.Textarea(attrs={'class': 'review-item', 'placeholder': 'Оставьте ваш отзыв здесь'}),
        }
        labels = {
            'name': 'Имя',
            'review': '',
            'number': 'Номер телефона',
        }
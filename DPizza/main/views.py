import datetime
import sqlite3

from django.shortcuts import render, redirect
from django.http import HttpResponseRedirect
from django.urls import reverse
from django.contrib import sessions
from .forms import ReviewsForm
from .models import Reviews
import pytz

def index(request):
    form = ReviewsForm()
    base_data = Reviews.objects.all()
    if request.method == 'POST':
        if 'sendReview' in request.POST:
            form = ReviewsForm(request.POST)
            if form.is_valid():
                    current_date = datetime.datetime.now(pytz.timezone('Europe/Moscow'))
                    suc_format = current_date.strftime("%m-%d-%y %T")
                    form.instance.registration_date = suc_format
                    print('СОХРАНЯЮ ФОРМУ')
                    form.save()
                    return redirect('index')
            if form.errors:
                # простое отслеживание ошибки, можно удалить при выгрузке сайта
                print(form.errors)
        if 'successOrder' in request.POST:
            total_amount = request.POST.get('totalPrice')
            url = reverse('success', args=[total_amount])
            return HttpResponseRedirect(url)

    data = {'form': form,'base_data': base_data}
    return render(request, 'main/index.html', data)

def success(request, price):
    commission = price * 0.01
    current_price = price + commission
    data = {
        'current_price': current_price,
        'commission': commission
    }
    if request.method == 'POST':
        if 'success-btn' in request.POST:
            card_number = request.POST.get('cardnumber')
            expiration_date = request.POST.get('cardexpiration')
            cvc_code = request.POST.get('cardcvc')
            card = [card_number, expiration_date, cvc_code]
            request.session['card'] = card # создаем в сессии card
            return redirect('test')
    return render(request, 'main/success.html', data)

def test(request):
    card = request.session.get('card', [])
    return render(request, 'main/test.html', {'card': card})
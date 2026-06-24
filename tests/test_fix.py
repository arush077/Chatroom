import pytest
from bs4 import BeautifulSoup
import os

# Happy path
def test_header_size():
    with open('frontend/index.html', 'r') as file:
        html = file.read()
    soup = BeautifulSoup(html, 'html.parser')
    header = soup.find('header')
    assert header is not None
    assert 'style' in header.attrs
    assert 'font-size: 24px' in header.attrs['style']

# Edge case
def test_header_size_empty_file():
    with open('frontend/index.html', 'w') as file:
        file.write('')
    with open('frontend/index.html', 'r') as file:
        html = file.read()
    soup = BeautifulSoup(html, 'html.parser')
    header = soup.find('header')
    assert header is None

# Regression
def test_existing_functionality():
    with open('frontend/index.html', 'r') as file:
        html = file.read()
    soup = BeautifulSoup(html, 'html.parser')
    title = soup.find('title')
    assert title is not None
    assert title.text == 'NoirChat'
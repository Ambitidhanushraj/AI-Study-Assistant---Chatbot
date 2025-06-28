#!/usr/bin/env python3
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter

def create_test_pdf():
    # Create a PDF file
    c = canvas.Canvas("test_document.pdf", pagesize=letter)
    width, height = letter
    
    # Add title
    c.setFont("Helvetica-Bold", 16)
    c.drawString(100, height - 100, "AI Study Assistant Test Document")
    
    # Add content
    c.setFont("Helvetica", 12)
    content = [
        "This is a test document for the AI Study Assistant.",
        "",
        "Key Topics:",
        "1. Artificial Intelligence",
        "2. Machine Learning",
        "3. Natural Language Processing",
        "4. Deep Learning",
        "",
        "Artificial Intelligence (AI) is a branch of computer science that aims to create",
        "intelligent machines that work and react like humans. Some of the activities",
        "computers with artificial intelligence are designed for include speech recognition,",
        "learning, planning, and problem solving.",
        "",
        "Machine Learning is a subset of AI that enables computers to learn and improve",
        "from experience without being explicitly programmed. It focuses on developing",
        "computer programs that can access data and use it to learn for themselves.",
        "",
        "Natural Language Processing (NLP) is a field of AI that gives machines the ability",
        "to read, understand, and derive meaning from human languages.",
        "",
        "Deep Learning is a subset of machine learning that uses neural networks with",
        "multiple layers to model and understand complex patterns in data."
    ]
    
    y_position = height - 150
    for line in content:
        if y_position < 50:  # Start new page if needed
            c.showPage()
            c.setFont("Helvetica", 12)
            y_position = height - 50
        c.drawString(100, y_position, line)
        y_position -= 20
    
    c.save()
    print("Test PDF created: test_document.pdf")

if __name__ == "__main__":
    create_test_pdf() 
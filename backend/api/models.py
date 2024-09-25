from django.db import models

class User(models.Model):
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    user_type = models.CharField(max_length=7, choices=[('teacher', 'Teacher'), ('parent', 'Parent')])

class Student(models.Model):
    student_name = models.CharField(max_length=100)
    student_grade = models.CharField(max_length=5)

class Parent(models.Model):
    parent_name = models.CharField(max_length=100)
    user = models.OneToOneField(User, on_delete=models.CASCADE, unique=True)

class Teacher(models.Model):
    teacher_name = models.CharField(max_length=100)
    user = models.OneToOneField(User, on_delete=models.CASCADE, unique=True)

class Class(models.Model):
    class_name = models.CharField(max_length=100)
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE)

class ParentStudent(models.Model):
    parent = models.ForeignKey(Parent, on_delete=models.CASCADE)
    student = models.ForeignKey(Student, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('parent', 'student')

class ClassStudent(models.Model):
    class_obj = models.ForeignKey(Class, on_delete=models.CASCADE)
    student = models.ForeignKey(Student, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('class_obj', 'student')

class AssignmentType(models.Model):
    type_name = models.CharField(max_length=50)

class Assignment(models.Model):
    class_obj = models.ForeignKey(Class, on_delete=models.CASCADE)
    type = models.ForeignKey(AssignmentType, on_delete=models.CASCADE)
    assignment_name = models.CharField(max_length=255)
    due_date = models.DateField()

class Grade(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    assignment = models.ForeignKey(Assignment, on_delete=models.CASCADE)
    grade = models.DecimalField(max_digits=5, decimal_places=2)
    feedback = models.TextField()

class Event(models.Model):
    event_name = models.CharField(max_length=255)
    event_description = models.TextField()
    event_date = models.DateField()
    event_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    created_at = models.DateTimeField(auto_now_add=True)

class EventRegistration(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    parent = models.ForeignKey(Parent, on_delete=models.CASCADE)
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    registration_date = models.DateTimeField(auto_now_add=True)

class EventPayment(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    parent = models.ForeignKey(Parent, on_delete=models.CASCADE)
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2)
    payment_date = models.DateTimeField(auto_now_add=True)
    payment_status = models.CharField(max_length=10, choices=[('pending', 'Pending'), ('completed', 'Completed'), ('failed', 'Failed')], default='pending')

class EventForm(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    form_name = models.CharField(max_length=255)
    form_description = models.TextField()
    form_content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

class FormSignature(models.Model):
    form = models.ForeignKey(EventForm, on_delete=models.CASCADE)
    parent = models.ForeignKey(Parent, on_delete=models.CASCADE)
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    signature = models.TextField()
    signed_at = models.DateTimeField(auto_now_add=True)
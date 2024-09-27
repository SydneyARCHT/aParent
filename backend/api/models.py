
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        return self.create_user(email, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):  
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    userType = models.CharField(max_length=10, choices=[('teacher', 'Teacher'), ('parent', 'Parent')])
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    groups = models.ManyToManyField(
        'auth.Group',
        related_name='custom_user_set',  
        blank=True,
        help_text='The groups this user belongs to.',
        verbose_name='groups'
    )

    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='custom_user_permissions_set',  
        blank=True,
        help_text='Specific permissions for this user.',
        verbose_name='user permissions'
    )

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email

    
    
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
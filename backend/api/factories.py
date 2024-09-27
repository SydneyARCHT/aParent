import factory
from faker import Faker
from .models import User, Student, Parent, Teacher, Class, ParentStudent, ClassStudent, AssignmentType, Assignment, Grade, Event, EventRegistration, EventPayment, EventForm, FormSignature

fake = Faker()

class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = User

    email = factory.LazyAttribute(lambda _: fake.email())
    password = factory.PostGenerationMethodCall('set_password', 'password')
    userType = 'parent'

class StudentFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Student

    student_name = factory.LazyAttribute(lambda _: fake.name())
    student_grade = factory.LazyAttribute(lambda _: fake.random_element(elements=('A', 'B', 'C', 'D', 'F')))
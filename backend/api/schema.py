import graphene
import graphql_jwt
from graphene_django.types import DjangoObjectType
from django.contrib.auth import get_user_model, authenticate, login
from graphql_jwt.decorators import login_required
from graphql_jwt.shortcuts import get_token
from .models import (
    User, Student, Parent, Teacher, Class, ParentStudent, ClassStudent, 
    AssignmentType, Assignment, Grade, Event, EventRegistration, EventPayment, 
    EventForm, FormSignature
)
from .util import token_required, encode_token, encode_refresh_token


class UserType(DjangoObjectType):
    class Meta:
        model = User
        fields = ('id', 'email', 'userType')
    
    groups = graphene.List(graphene.String)
    user_permissions = graphene.List(graphene.String)

    def resolve_groups(self, info):
        return [group.name for group in self.groups.all()]

    def resolve_user_permissions(self, info):
        return [perm.codename for perm in self.user_permissions.all()]
    

    
class LoginMutation(graphene.Mutation):
    class Arguments:
        email = graphene.String(required=True)
        password = graphene.String(required=True)
        
    user = graphene.Field(UserType)
    access_token = graphene.String()
    refresh_token = graphene.String()
    
    def mutate(self, info, email, password):
        user = authenticate(username=email, password=password)
        if user is None:
            raise Exception('Invalid Credentials')
        
        login(info.context, user)
        access_token = encode_token(user.id, user.userType)
        refresh_token = encode_refresh_token(user.id, user.userType)
        return LoginMutation(user=user, access_token=access_token, refresh_token=refresh_token)
    
class Logout(graphene.Mutation):
    success = graphene.Boolean()

    @token_required
    def mutate(self, info):
        info.context.user.auth_token.delete()
        return Logout(success=True)


class StudentType(DjangoObjectType):
    class Meta:
        model = Student

class ParentType(DjangoObjectType):
    class Meta:
        model = Parent

class TeacherType(DjangoObjectType):
    class Meta:
        model = Teacher

class ClassType(DjangoObjectType):
    class Meta:
        model = Class

class ParentStudentType(DjangoObjectType):
    class Meta:
        model = ParentStudent


class ClassStudentType(DjangoObjectType):
    class Meta:
        model = ClassStudent

class AssignmentTypeType(DjangoObjectType):
    class Meta:
        model = AssignmentType

class AssignmentType(DjangoObjectType):
    class Meta:
        model = Assignment

class GradeType(DjangoObjectType):
    class Meta:
        model = Grade

class EventType(DjangoObjectType):
    class Meta:
        model = Event

class EventRegistrationType(DjangoObjectType):
    class Meta:
        model = EventRegistration

class EventPaymentType(DjangoObjectType):
    class Meta:
        model = EventPayment

class EventFormType(DjangoObjectType):
    class Meta:
        model = EventForm

class FormSignatureType(DjangoObjectType):
    class Meta:
        model = FormSignature


class CreateStudent(graphene.Mutation):
    class Arguments:
        student_name = graphene.String(required=True)
        student_grade = graphene.String(required=True)

    student = graphene.Field(StudentType)

    @token_required
    def mutate(self, info, student_name, student_grade):
        student = Student(student_name=student_name, student_grade=student_grade)
        student.save()
        return CreateStudent(student=student)

class UpdateStudent(graphene.Mutation):
    class Arguments:
        student_id = graphene.ID(required=True)
        student_name = graphene.String()
        student_grade = graphene.String()

    student = graphene.Field(StudentType)

    @token_required
    def mutate(self, info, student_id, student_name=None, student_grade=None):
        student = Student.objects.get(pk=student_id)
        if student_name:
            student.student_name = student_name
        if student_grade:
            student.student_grade = student_grade
        student.save()
        return UpdateStudent(student=student)

class DeleteStudent(graphene.Mutation):
    class Arguments:
        student_id = graphene.ID(required=True)

    success = graphene.Boolean()
    
    @token_required
    def mutate(self, info, student_id):
        student = Student.objects.get(pk=student_id)
        student.delete()
        return DeleteStudent(success=True)


class CreateUser(graphene.Mutation):
    class Arguments:
        email = graphene.String(required=True)
        password = graphene.String(required=True)
        userType = graphene.String(required=True)
        name = graphene.String(required=True)

    user = graphene.Field(UserType)
    success = graphene.Boolean()
    message = graphene.String()
    token = graphene.String()

    def mutate(self, info, email, password, userType, name):
        if User.objects.filter(email=email).exists():
            return CreateUser(success=False, message="Email already exists")

        normalized_user_type = userType.lower()
        user = User.objects.create_user(email=email, password=password, userType=normalized_user_type)
        
        if normalized_user_type == "parent":
            create_parent_mutation = CreateParent()
            create_parent_mutation.mutate(info, parent_name=name, user_id=user.id)
        elif normalized_user_type == "teacher":
            create_teacher_mutation = CreateTeacher()
            create_teacher_mutation.mutate(info, teacher_name=name, user_id=user.id)

        token = get_token(user)
        return CreateUser(user=user, success=True, message="User created successfully", token=token)
    
    
class UpdateUser(graphene.Mutation):
    class Arguments:
        user_id = graphene.ID(required=True)
        email = graphene.String()
        password = graphene.String()
        user_type = graphene.String()

    user = graphene.Field(UserType)

    @token_required
    def mutate(self, info, user_id, email=None, password=None, user_type=None):
        user = User.objects.get(pk=user_id)
        if email:
            user.email = email
        if password:
            user.password = password
        if user_type:
            user.user_type = user_type
        user.save()
        return UpdateUser(user=user)

class DeleteUser(graphene.Mutation):
    class Arguments:
        user_id = graphene.ID(required=True)

    success = graphene.Boolean()

    @token_required
    def mutate(self, info, user_id):
        user = User.objects.get(pk=user_id)
        user.delete()
        return DeleteUser(success=True)

class CreateParent(graphene.Mutation):
    class Arguments:
        parent_name = graphene.String(required=True)
        user_id = graphene.ID(required=True)
        
    parent = graphene.Field(ParentType)


    def mutate(self, info, parent_name, user_id):
        
        user = User.objects.get(pk=user_id)
        parent = Parent(parent_name=parent_name, user=user)
        parent.save()
        return CreateParent(parent=parent)

class UpdateParent(graphene.Mutation):
    class Arguments:
        parent_id = graphene.ID(required=True)
        parent_name = graphene.String()

    parent = graphene.Field(ParentType)

    @token_required
    def mutate(self, info, parent_id, parent_name=None):
        parent = Parent.objects.get(pk=parent_id)
        if parent_name:
            parent.parent_name = parent_name
        parent.save()
        return UpdateParent(parent=parent)

class DeleteParent(graphene.Mutation):
    class Arguments:
        parent_id = graphene.ID(required=True)

    success = graphene.Boolean()

    @token_required
    def mutate(self, info, parent_id):
        parent = Parent.objects.get(pk=parent_id)
        parent.delete()
        return DeleteParent(success=True)

class CreateTeacher(graphene.Mutation):
    class Arguments:
        teacher_name = graphene.String(required=True)

    teacher = graphene.Field(TeacherType)

    def mutate(self, info, teacher_name):
        teacher = Teacher(teacher_name=teacher_name)
        teacher.save()
        return CreateTeacher(teacher=teacher)

class UpdateTeacher(graphene.Mutation):
    class Arguments:
        teacher_id = graphene.ID(required=True)
        teacher_name = graphene.String()

    teacher = graphene.Field(TeacherType)

    @token_required
    def mutate(self, info, teacher_id, teacher_name=None):
        teacher = Teacher.objects.get(pk=teacher_id)
        if teacher_name:
            teacher.teacher_name = teacher_name
        teacher.save()
        return UpdateTeacher(teacher=teacher)

class DeleteTeacher(graphene.Mutation):
    class Arguments:
        teacher_id = graphene.ID(required=True)

    success = graphene.Boolean()

    @token_required
    def mutate(self, info, teacher_id):
        teacher = Teacher.objects.get(pk=teacher_id)
        teacher.delete()
        return DeleteTeacher(success=True)

class CreateClass(graphene.Mutation):
    class Arguments:
        class_name = graphene.String(required=True)
        teacher_id = graphene.ID(required=True)

    class_obj = graphene.Field(ClassType)

    @token_required
    def mutate(self, info, class_name, teacher_id):
        teacher = Teacher.objects.get(pk=teacher_id)
        class_obj = Class(class_name=class_name, teacher=teacher)
        class_obj.save()
        return CreateClass(class_obj=class_obj)

class UpdateClass(graphene.Mutation):
    class Arguments:
        class_id = graphene.ID(required=True)
        class_name = graphene.String()
        teacher_id = graphene.ID()

    class_obj = graphene.Field(ClassType)

    @token_required
    def mutate(self, info, class_id, class_name=None, teacher_id=None):
        class_obj = Class.objects.get(pk=class_id)
        if class_name:
            class_obj.class_name = class_name
        if teacher_id:
            teacher = Teacher.objects.get(pk=teacher_id)
            class_obj.teacher = teacher
        class_obj.save()
        return UpdateClass(class_obj=class_obj)

class DeleteClass(graphene.Mutation):
    class Arguments:
        class_id = graphene.ID(required=True)

    success = graphene.Boolean()

    @token_required
    def mutate(self, info, class_id):
        class_obj = Class.objects.get(pk=class_id)
        class_obj.delete()
        return DeleteClass(success=True)

class CreateParentStudent(graphene.Mutation):
    class Arguments:
        parent_id = graphene.ID(required=True)
        student_id = graphene.ID(required=True)

    parent_student = graphene.Field(ParentStudentType)

    @token_required
    def mutate(self, info, parent_id, student_id):
        parent = Parent.objects.get(pk=parent_id)
        student = Student.objects.get(pk=student_id)
        parent_student = ParentStudent(parent=parent, student=student)
        parent_student.save()
        return CreateParentStudent(parent_student=parent_student)

class DeleteParentStudent(graphene.Mutation):
    class Arguments:
        parent_id = graphene.ID(required=True)
        student_id = graphene.ID(required=True)

    success = graphene.Boolean()

    @token_required
    def mutate(self, info, parent_id, student_id):
        parent_student = ParentStudent.objects.get(parent_id=parent_id, student_id=student_id)
        parent_student.delete()
        return DeleteParentStudent(success=True)




class CreateClassStudent(graphene.Mutation):
    class Arguments:
        class_id = graphene.ID(required=True)
        student_id = graphene.ID(required=True)

    class_student = graphene.Field(ClassStudentType)

    def mutate(self, info, class_id, student_id):
        class_obj = Class.objects.get(pk=class_id)
        student = Student.objects.get(pk=student_id)
        class_student = ClassStudent(class_obj=class_obj, student=student)
        class_student.save()
        return CreateClassStudent(class_student=class_student)

class CreateAssignmentType(graphene.Mutation):
    class Arguments:
        type_name = graphene.String(required=True)

    assignment_type = graphene.Field(AssignmentTypeType)


    def mutate(self, info, type_name):
        assignment_type = AssignmentType(type_name=type_name)
        assignment_type.save()
        return CreateAssignmentType(assignment_type=assignment_type)

class CreateAssignment(graphene.Mutation):
    class Arguments:
        class_id = graphene.ID(required=True)
        type_id = graphene.ID(required=True)
        assignment_name = graphene.String(required=True)
        due_date = graphene.Date(required=True)

    assignment = graphene.Field(AssignmentType)

    @token_required
    def mutate(self, info, class_id, type_id, assignment_name, due_date):
        class_obj = Class.objects.get(pk=class_id)
        type_obj = AssignmentType.objects.get(pk=type_id)
        assignment = Assignment(class_obj=class_obj, type=type_obj, assignment_name=assignment_name, due_date=due_date)
        assignment.save()
        return CreateAssignment(assignment=assignment)

class CreateGrade(graphene.Mutation):
    class Arguments:
        student_id = graphene.ID(required=True)
        assignment_id = graphene.ID(required=True)
        grade = graphene.Float(required=True)
        feedback = graphene.String()

    grade_obj = graphene.Field(GradeType)

    @token_required
    def mutate(self, info, student_id, assignment_id, grade, feedback=None):
        student = Student.objects.get(pk=student_id)
        assignment = Assignment.objects.get(pk=assignment_id)
        grade_obj = Grade(student=student, assignment=assignment, grade=grade, feedback=feedback)
        grade_obj.save()
        return CreateGrade(grade_obj=grade_obj)

class CreateEvent(graphene.Mutation):
    class Arguments:
        event_name = graphene.String(required=True)
        event_description = graphene.String(required=True)
        event_date = graphene.Date(required=True)
        event_fee = graphene.Float()

    event = graphene.Field(EventType)

    @token_required
    def mutate(self, info, event_name, event_description, event_date, event_fee=0.00):
        event = Event(event_name=event_name, event_description=event_description, event_date=event_date, event_fee=event_fee)
        event.save()
        return CreateEvent(event=event)

class CreateEventRegistration(graphene.Mutation):
    class Arguments:
        event_id = graphene.ID(required=True)
        parent_id = graphene.ID(required=True)
        student_id = graphene.ID(required=True)

    event_registration = graphene.Field(EventRegistrationType)

    def mutate(self, info, event_id, parent_id, student_id):
        event = Event.objects.get(pk=event_id)
        parent = Parent.objects.get(pk=parent_id)
        student = Student.objects.get(pk=student_id)
        event_registration = EventRegistration(event=event, parent=parent, student=student)
        event_registration.save()
        return CreateEventRegistration(event_registration=event_registration)

class CreateEventPayment(graphene.Mutation):
    class Arguments:
        event_id = graphene.ID(required=True)
        parent_id = graphene.ID(required=True)
        student_id = graphene.ID(required=True)
        amount_paid = graphene.Float(required=True)
        payment_status = graphene.String()

    event_payment = graphene.Field(EventPaymentType)

    def mutate(self, info, event_id, parent_id, student_id, amount_paid, payment_status='pending'):
        event = Event.objects.get(pk=event_id)
        parent = Parent.objects.get(pk=parent_id)
        student = Student.objects.get(pk=student_id)
        event_payment = EventPayment(event=event, parent=parent, student=student, amount_paid=amount_paid, payment_status=payment_status)
        event_payment
        


class CreateClassStudent(graphene.Mutation):
    class Arguments:
        class_id = graphene.ID(required=True)
        student_id = graphene.ID(required=True)

    class_student = graphene.Field(ClassStudentType)

    def mutate(self, info, class_id, student_id):
        class_obj = Class.objects.get(pk=class_id)
        student = Student.objects.get(pk=student_id)
        class_student = ClassStudent(class_obj=class_obj, student=student)
        class_student.save()
        return CreateClassStudent(class_student=class_student)

class CreateAssignmentType(graphene.Mutation):
    class Arguments:
        type_name = graphene.String(required=True)

    assignment_type = graphene.Field(AssignmentTypeType)

    def mutate(self, info, type_name):
        assignment_type = AssignmentType(type_name=type_name)
        assignment_type.save()
        return CreateAssignmentType(assignment_type=assignment_type)

class CreateAssignment(graphene.Mutation):
    class Arguments:
        class_id = graphene.ID(required=True)
        type_id = graphene.ID(required=True)
        assignment_name = graphene.String(required=True)
        due_date = graphene.Date(required=True)

    assignment = graphene.Field(AssignmentType)

    @token_required
    def mutate(self, info, class_id, type_id, assignment_name, due_date):
        class_obj = Class.objects.get(pk=class_id)
        type_obj = AssignmentType.objects.get(pk=type_id)
        assignment = Assignment(class_obj=class_obj, type=type_obj, assignment_name=assignment_name, due_date=due_date)
        assignment.save()
        return CreateAssignment(assignment=assignment)

class CreateGrade(graphene.Mutation):
    class Arguments:
        student_id = graphene.ID(required=True)
        assignment_id = graphene.ID(required=True)
        grade = graphene.Float(required=True)
        feedback = graphene.String()

    grade_obj = graphene.Field(GradeType)

    @token_required
    def mutate(self, info, student_id, assignment_id, grade, feedback=None):
        student = Student.objects.get(pk=student_id)
        assignment = Assignment.objects.get(pk=assignment_id)
        grade_obj = Grade(student=student, assignment=assignment, grade=grade, feedback=feedback)
        grade_obj.save()
        return CreateGrade(grade_obj=grade_obj)

class CreateEvent(graphene.Mutation):
    class Arguments:
        event_name = graphene.String(required=True)
        event_description = graphene.String(required=True)
        event_date = graphene.Date(required=True)
        event_fee = graphene.Float()

    event = graphene.Field(EventType)

    def mutate(self, info, event_name, event_description, event_date, event_fee=0.00):
        event = Event(event_name=event_name, event_description=event_description, event_date=event_date, event_fee=event_fee)
        event.save()
        return CreateEvent(event=event)

class CreateEventRegistration(graphene.Mutation):
    class Arguments:
        event_id = graphene.ID(required=True)
        parent_id = graphene.ID(required=True)
        student_id = graphene.ID(required=True)

    event_registration = graphene.Field(EventRegistrationType)

    def mutate(self, info, event_id, parent_id, student_id):
        event = Event.objects.get(pk=event_id)
        parent = Parent.objects.get(pk=parent_id)
        student = Student.objects.get(pk=student_id)
        event_registration = EventRegistration(event=event, parent=parent, student=student)
        event_registration.save()
        return CreateEventRegistration(event_registration=event_registration)

class CreateEventPayment(graphene.Mutation):
    class Arguments:
        event_id = graphene.ID(required=True)
        parent_id = graphene.ID(required=True)
        student_id = graphene.ID(required=True)
        amount_paid = graphene.Float(required=True)
        payment_status = graphene.String()

    event_payment = graphene.Field(EventPaymentType)

    def mutate(self, info, event_id, parent_id, student_id, amount_paid, payment_status='pending'):
        event = Event.objects.get(pk=event_id)
        parent = Parent.objects.get(pk=parent_id)
        student = Student.objects.get(pk=student_id)
        event_payment = EventPayment(event=event, parent=parent, student=student, amount_paid=amount_paid, payment_status=payment_status)
        event_payment.save()
        return CreateEventPayment(event_payment=event_payment)

class CreateEventForm(graphene.Mutation):
    class Arguments:
        event_id = graphene.ID(required=True)
        form_name = graphene.String(required=True)
        form_description = graphene.String(required=True)
        form_content = graphene.String(required=True)

    event_form = graphene.Field(EventFormType)

    @token_required
    def mutate(self, info, event_id, form_name, form_description, form_content):
        event = Event.objects.get(pk=event_id)
        event_form = EventForm(event=event, form_name=form_name, form_description=form_description, form_content=form_content)
        event_form.save()
        return CreateEventForm(event_form=event_form)

class CreateFormSignature(graphene.Mutation):
    class Arguments:
        form_id = graphene.ID(required=True)
        parent_id = graphene.ID(required=True)
        student_id = graphene.ID(required=True)
        signature = graphene.String(required=True)

    form_signature = graphene.Field(FormSignatureType)

    def mutate(self, info, form_id, parent_id, student_id, signature):
        form = EventForm.objects.get(pk=form_id)
        parent = Parent.objects.get(pk=parent_id)
        student = Student.objects.get(pk=student_id)
        form_signature = FormSignature(form=form, parent=parent, student=student, signature=signature)
        form_signature.save()
        return CreateFormSignature(form_signature=form_signature)
    
    
    
class ObtainJSONWebToken(graphql_jwt.JSONWebTokenMutation):
    user = graphene.Field(UserType)
    
    
    @classmethod
    def resolve(cls, root, info, **kwargs):
        return cls(user=info.context.user)

class Mutation(graphene.ObjectType):
    create_student = CreateStudent.Field()
    update_student = UpdateStudent.Field()
    delete_student = DeleteStudent.Field()
    create_user = CreateUser.Field()
    update_user = UpdateUser.Field()
    delete_user = DeleteUser.Field()
    create_parent = CreateParent.Field()
    update_parent = UpdateParent.Field()
    delete_parent = DeleteParent.Field()
    create_teacher = CreateTeacher.Field()
    update_teacher = UpdateTeacher.Field()
    delete_teacher = DeleteTeacher.Field()
    create_class = CreateClass.Field()
    update_class = UpdateClass.Field()
    delete_class = DeleteClass.Field()
    create_parent_student = CreateParentStudent.Field()
    delete_parent_student = DeleteParentStudent.Field()
    create_class_student = CreateClassStudent.Field()
    create_assignment_type = CreateAssignmentType.Field()
    create_assignment = CreateAssignment.Field()
    create_grade = CreateGrade.Field()
    create_event = CreateEvent.Field()
    create_event_registration = CreateEventRegistration.Field()
    create_event_payment = CreateEventPayment.Field()
    create_event_form = CreateEventForm.Field()
    create_form_signature = CreateFormSignature.Field()
    token_auth = graphql_jwt.ObtainJSONWebToken.Field()
    verify_token = graphql_jwt.Verify.Field()
    refresh_token = graphql_jwt.Refresh.Field()
    login = LoginMutation.Field()
    logout = Logout.Field()

class Query(graphene.ObjectType):
    all_users = graphene.List(UserType)
    all_students = graphene.List(StudentType)
    all_parents = graphene.List(ParentType)
    all_teachers = graphene.List(TeacherType)
    all_classes = graphene.List(ClassType)

    @token_required
    def resolve_all_users(self, info):
        return User.objects.all()

    @token_required
    def resolve_all_students(self, info):
        return Student.objects.all()

    @token_required
    def resolve_all_parents(self, info):
        return Parent.objects.all()

    @token_required
    def resolve_all_teachers(self, info):
        return Teacher.objects.all()

    @token_required
    def resolve_all_classes(self, info):
        return Class.objects.all()

schema = graphene.Schema(query=Query, mutation=Mutation)
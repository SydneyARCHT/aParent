# Generated by Django 5.1.1 on 2024-09-24 09:50

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        ("auth", "0012_alter_user_first_name_max_length"),
    ]

    operations = [
        migrations.CreateModel(
            name="AssignmentType",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("type_name", models.CharField(max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name="Class",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("class_name", models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name="Event",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("event_name", models.CharField(max_length=255)),
                ("event_description", models.TextField()),
                ("event_date", models.DateField()),
                (
                    "event_fee",
                    models.DecimalField(decimal_places=2, default=0.0, max_digits=10),
                ),
                ("created_at", models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name="Student",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("student_name", models.CharField(max_length=100)),
                ("student_grade", models.CharField(max_length=5)),
            ],
        ),
        migrations.CreateModel(
            name="User",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "last_login",
                    models.DateTimeField(
                        blank=True, null=True, verbose_name="last login"
                    ),
                ),
                (
                    "is_superuser",
                    models.BooleanField(
                        default=False,
                        help_text="Designates that this user has all permissions without explicitly assigning them.",
                        verbose_name="superuser status",
                    ),
                ),
                ("email", models.EmailField(max_length=254, unique=True)),
                ("password", models.CharField(max_length=255)),
                (
                    "userType",
                    models.CharField(
                        choices=[("teacher", "Teacher"), ("parent", "Parent")],
                        max_length=10,
                    ),
                ),
                ("is_active", models.BooleanField(default=True)),
                ("is_staff", models.BooleanField(default=False)),
                (
                    "groups",
                    models.ManyToManyField(
                        blank=True,
                        help_text="The groups this user belongs to.",
                        related_name="custom_user_set",
                        to="auth.group",
                        verbose_name="groups",
                    ),
                ),
                (
                    "user_permissions",
                    models.ManyToManyField(
                        blank=True,
                        help_text="Specific permissions for this user.",
                        related_name="custom_user_permissions_set",
                        to="auth.permission",
                        verbose_name="user permissions",
                    ),
                ),
            ],
            options={
                "abstract": False,
            },
        ),
        migrations.CreateModel(
            name="Assignment",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("assignment_name", models.CharField(max_length=255)),
                ("due_date", models.DateField()),
                (
                    "type",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="api.assignmenttype",
                    ),
                ),
                (
                    "class_obj",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="api.class"
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="EventForm",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("form_name", models.CharField(max_length=255)),
                ("form_description", models.TextField()),
                ("form_content", models.TextField()),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                (
                    "event",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="api.event"
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Parent",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("parent_name", models.CharField(max_length=100)),
                (
                    "user",
                    models.OneToOneField(
                        on_delete=django.db.models.deletion.CASCADE,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Grade",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("grade", models.DecimalField(decimal_places=2, max_digits=5)),
                ("feedback", models.TextField()),
                (
                    "assignment",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="api.assignment"
                    ),
                ),
                (
                    "student",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="api.student"
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="FormSignature",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("signature", models.TextField()),
                ("signed_at", models.DateTimeField(auto_now_add=True)),
                (
                    "form",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="api.eventform"
                    ),
                ),
                (
                    "parent",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="api.parent"
                    ),
                ),
                (
                    "student",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="api.student"
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="EventRegistration",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("registration_date", models.DateTimeField(auto_now_add=True)),
                (
                    "event",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="api.event"
                    ),
                ),
                (
                    "parent",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="api.parent"
                    ),
                ),
                (
                    "student",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="api.student"
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="EventPayment",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("amount_paid", models.DecimalField(decimal_places=2, max_digits=10)),
                ("payment_date", models.DateTimeField(auto_now_add=True)),
                (
                    "payment_status",
                    models.CharField(
                        choices=[
                            ("pending", "Pending"),
                            ("completed", "Completed"),
                            ("failed", "Failed"),
                        ],
                        default="pending",
                        max_length=10,
                    ),
                ),
                (
                    "event",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="api.event"
                    ),
                ),
                (
                    "parent",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="api.parent"
                    ),
                ),
                (
                    "student",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="api.student"
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Teacher",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("teacher_name", models.CharField(max_length=100)),
                (
                    "user",
                    models.OneToOneField(
                        on_delete=django.db.models.deletion.CASCADE,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
        migrations.AddField(
            model_name="class",
            name="teacher",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE, to="api.teacher"
            ),
        ),
        migrations.CreateModel(
            name="ParentStudent",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "parent",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="api.parent"
                    ),
                ),
                (
                    "student",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="api.student"
                    ),
                ),
            ],
            options={
                "unique_together": {("parent", "student")},
            },
        ),
        migrations.CreateModel(
            name="ClassStudent",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "class_obj",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="api.class"
                    ),
                ),
                (
                    "student",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="api.student"
                    ),
                ),
            ],
            options={
                "unique_together": {("class_obj", "student")},
            },
        ),
    ]

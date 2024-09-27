from django.test import TestCase, Client
from graphene_django.utils.testing import GraphQLTestCase
from api.factories import UserFactory, StudentFactory
from api.schema import schema
from api.util import encode_token, encode_refresh_token


class UserTestCase(GraphQLTestCase):
    GRAPHQL_SCHEMA = schema

    def setUp(self):
        self.client = Client()
        self.user = UserFactory()
        self.access_token = encode_token(self.user.id, self.user.userType)
        self.refresh_token = encode_refresh_token(self.user.id, self.user.userType)

    def test_login(self):
        response = self.query(
            '''
            mutation {
                tokenAuth(email: "user@example.com", password: "password") {
                    access_token
                    refresh_token
                    user {
                        id
                        email
                    }
                }
            }
            ''',
            headers={
                'CONTENT_TYPE': 'application/json'
            }
        )
        print(response.content.decode())  # Print the response content to help debug

        self.assertResponseNoErrors(response)
        content = response.json()
        self.assertIn('access_token', content['data']['tokenAuth'])
        self.assertIn('refresh_token', content['data']['tokenAuth'])
        self.assertEqual(content['data']['tokenAuth']['user']['email'], self.user.email)

    def test_protected_query(self):
        response = self.query(
            '''
            query {
                allUsers {
                    id
                    email
                }
            }
            ''',
            headers={
                'HTTP_AUTHORIZATION': f'Bearer {self.access_token}',
                'CONTENT_TYPE': 'application/json'
            }
        )
        print(response.content.decode())  # Print the response content to help debug

        self.assertResponseNoErrors(response)
        content = response.json()
        self.assertGreater(len(content['data']['allUsers']), 0)

    def test_refresh_token(self):
        response = self.query(
            '''
            mutation {
                refreshToken(refreshToken: "%s") {
                    access_token
                }
            }
            ''' % self.refresh_token,
            headers={
                'CONTENT_TYPE': 'application/json'
            }
        )
        print(response.content.decode())  # Print the response content to help debug

        self.assertResponseNoErrors(response)
        content = response.json()
        self.assertIn('access_token', content['data']['refreshToken'])

    def test_logout(self):
        response = self.query(
            '''
            mutation {
                logout {
                    success
                }
            }
            ''',
            headers={
                'HTTP_AUTHORIZATION': f'Bearer {self.access_token}',
                'CONTENT_TYPE': 'application/json'
            }
        )
        print(response.content.decode())  # Print the response content to help debug

        self.assertResponseNoErrors(response)
        content = response.json()
        self.assertTrue(content['data']['logout']['success'])


class StudentTestCase(GraphQLTestCase):
    GRAPHQL_SCHEMA = schema

    def setUp(self):
        self.client = Client()
        self.user = UserFactory()
        self.access_token = encode_token(self.user.id, self.user.userType)
        self.student = StudentFactory()

    def test_create_student(self):
        response = self.query(
            '''
            mutation {
                createStudent(studentName: "Jane Doe", studentGrade: "B") {
                    student {
                        id
                        studentName
                        studentGrade
                    }
                }
            }
            ''',
            headers={
                'HTTP_AUTHORIZATION': f'Bearer {self.access_token}',
                'CONTENT_TYPE': 'application/json'
            }
        )
        print(response.content.decode())  # Print the response content to help debug

        self.assertResponseNoErrors(response)
        content = response.json()
        self.assertEqual(content['data']['createStudent']['student']['studentName'], 'Jane Doe')
        self.assertEqual(content['data']['createStudent']['student']['studentGrade'], 'B')

    def test_update_student(self):
        response = self.query(
            '''
            mutation {
                updateStudent(id: %d, studentName: "John Smith", studentGrade: "A+") {
                    student {
                        id
                        studentName
                        studentGrade
                    }
                }
            }
            ''' % self.student.id,
            headers={
                'HTTP_AUTHORIZATION': f'Bearer {self.access_token}',
                'CONTENT_TYPE': 'application/json'
            }
        )
        print(response.content.decode())  # Print the response content to help debug

        self.assertResponseNoErrors(response)
        content = response.json()
        self.assertEqual(content['data']['updateStudent']['student']['studentName'], 'John Smith')
        self.assertEqual(content['data']['updateStudent']['student']['studentGrade'], 'A+')

    def test_delete_student(self):
        response = self.query(
            '''
            mutation {
                deleteStudent(id: %d) {
                    success
                }
            }
            ''' % self.student.id,
            headers={
                'HTTP_AUTHORIZATION': f'Bearer {self.access_token}',
                'CONTENT_TYPE': 'application/json'
            }
        )
        print(response.content.decode())  # Print the response content to help debug

        self.assertResponseNoErrors(response)
        content = response.json()
        self.assertTrue(content['data']['deleteStudent']['success'])
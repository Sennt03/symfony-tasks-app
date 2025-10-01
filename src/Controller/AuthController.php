<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use App\Entity\User;


class AuthController extends AbstractController
{
    #[Route(path: '/login', name: 'app_login')]
    public function login(AuthenticationUtils $authenticationUtils): Response
    {
        // get the login error if there is one
        $error = $authenticationUtils->getLastAuthenticationError();

        // last username entered by the user
        $lastUsername = $authenticationUtils->getLastUsername();

        return $this->render('auth/login.html.twig', [
            'last_username' => $lastUsername,
            'error' => $error,
        ]);
    }

    #[Route(path: '/logout', name: 'app_logout')]
    public function logout(): void
    {
        throw new \LogicException('This method can be blank - it will be intercepted by the logout key on your firewall.');
    }

    #[Route(path: '/register', name: 'app_register')]
public function register(
    Request $request,
    EntityManagerInterface $entityManager,
    UserPasswordHasherInterface $passwordHasher
): Response {
    $error = null;

    if ($request->isMethod('POST')) {
        $email = $request->request->get('email');
        $password = $request->request->get('password');
        $confirmPassword = $request->request->get('confirmPassword');

        // Validar campos obligatorios
        if (!$email || !$password || !$confirmPassword) {
            $error = 'Todos los campos son obligatorios.';
        }
        // Validar email
        elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $error = 'El correo no es válido.';
        }
        // Validar longitud de contraseña
        elseif (strlen($password) < 8) {
            $error = 'La contraseña debe tener al menos 8 caracteres.';
        }
        // Validar coincidencia de contraseñas
        elseif ($password !== $confirmPassword) {
            $error = 'Las contraseñas no coinciden.';
        }
        // Validar email duplicado
        elseif ($entityManager->getRepository(User::class)->findOneBy(['email' => $email])) {
            $error = 'El correo ya está registrado.';
        }

        // Si no hay errores, crear usuario
        if (!$error) {
            $user = new User();
            $user->setEmail($email);
            $user->setPassword($passwordHasher->hashPassword($user, $password));

            $entityManager->persist($user);
            $entityManager->flush();

            $this->addFlash('success', 'Usuario registrado correctamente!');

            return $this->redirectToRoute('app_login');
        }
    }

    return $this->render('auth/register.html.twig', [
        'error' => $error,
    ]);
}

}

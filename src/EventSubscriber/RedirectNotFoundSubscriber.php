<?php
// src/EventSubscriber/RedirectNotFoundSubscriber.php
namespace App\EventSubscriber;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpKernel\Event\ExceptionEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

final class RedirectNotFoundSubscriber implements EventSubscriberInterface
{
    private UrlGeneratorInterface $urlGenerator;

    public function __construct(UrlGeneratorInterface $urlGenerator)
    {
        $this->urlGenerator = $urlGenerator;
    }

    public function onKernelException(ExceptionEvent $event)
    {
        $exception = $event->getThrowable();

        // Solo redirige si es un 404
        if ($exception instanceof NotFoundHttpException) {
            $request = $event->getRequest();
            $currentPath = $request->getPathInfo();

            // Evitar loop infinito: no redirigir /task
            if ($currentPath === '/task' || $currentPath === '/') {
                return;
            }

            $response = new RedirectResponse($this->urlGenerator->generate('app_task_index'));
            $event->setResponse($response);
        }
    }

    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::EXCEPTION => ['onKernelException', 10],
        ];
    }
}

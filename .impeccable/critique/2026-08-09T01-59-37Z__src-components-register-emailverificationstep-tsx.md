---
target: src/components/register/EmailVerificationStep.tsx
total_score: 23
p0_count: 1
p1_count: 1
timestamp: 2026-08-09T01-59-37Z
slug: src-components-register-emailverificationstep-tsx
---
# Critique: EmailVerificationStep.tsx

Method: dual-agent (A: ses_01bc3e81dffeGRFXUs5Op5uPAr · B: ses_01bc3d2f6ffeg0D2mnAnCQE1Go)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3/4 | Loading states en botones pero sin indicador de progreso entre pasos |
| 2 | Match System / Real World | 3/4 | Español natural, pero el grid de 6 cuadros sin explicación desorienta a no-técnicos |
| 3 | User Control and Freedom | 2/4 | Doble botón de salida (layout + componente) con destinos distintos |
| 4 | Consistency and Standards | 2/4 | Inputs y botones con vocabulario visual distinto al RegisterCard en la misma página |
| 5 | Error Prevention | 2/4 | Sin autoFocus en OTP, sin cooldown de reenvío, sin autocomplete="one-time-code" |
| 6 | Recognition Rather Than Recall | 3/4 | Email visible en paso OTP, labels claros |
| 7 | Flexibility and Efficiency | 2/4 | Buen soporte de paste, pero sin atajos de teclado ni timer de reenvío |
| 8 | Aesthetic and Minimalist Design | 3/4 | Limpio y enfocado, pero inconsistente con el resto de la página |
| 9 | Error Recovery | 2/4 | Errores inline pero genéricos; sin aria-describedby, sin foco automático |
| 10 | Help and Documentation | 1/4 | Cero ayuda contextual |
| **Total** | | **23/40** | **Acceptable** |

## Anti-Patterns Verdict

**LLM assessment**: Pasa el slop test. El problema no es "parece AI", es que parece de otro producto — vocabulario visual inconsistente con RegisterCard (misma página, dos lenguajes de diseño).

**Deterministic scan**: Clean. Los problemas están en integración contextual y accesibilidad manual.

## Overall Impression

El componente individualmente es sólido. El problema es contextual: cuando se renderiza dentro del gradient card violeta, las decisiones de diseño chocan. Ambos assessments detectaron independientemente los mismos tres problemas: contraste texto/gradiente, inconsistencia con RegisterCard, y accesibilidad OTP.

## What's Working

- Micro-interacciones del OTP impecables: filtro solo-dígitos, auto-avance, Backspace, paste.
- Progressive disclosure bien ejecutada: dos pasos limpios.
- Copy en español natural y cálido para LATAM.

## Priority Issues

- [P0] Texto oscuro invisible sobre el gradient card: título y subtítulo sin fondo blanco renderizan sobre violeta.
- [P1] Vocabulario visual inconsistente con RegisterCard: inputs rounded-xl vs rounded-[10px], botones rounded-xl vs rounded-full.
- [P2] Inputs OTP sin labels accesibles: 6 inputs sin aria-label. Placeholder falla contraste WCAG AA.
- [P2] Errores sin foco ni conexión semántica: sin aria-describedby, sin auto-focus en error.
- [P3] Doble botón de salida: layout + componente compiten.

## Persona Red Flags

Jordan (First-Timer): Grid OTP sin explicación desorienta. Error "Código inválido" no sugiere acción. Sin mención de spam.

Sam (Accesibilidad): 6 inputs sin aria-label. Placeholder 2.4:1. Focus ring apenas visible. Sin autocomplete SMS.

## Minor Observations

- resendSuccess nunca se auto-limpia
- MailIcon size-4 chico para mobile
- Sin autoComplete="email" ni "one-time-code"
- Sin :focus-visible en botones
- Transición instantánea entre pasos

## Questions

- ¿El RegisterLayout debería ser dueño del botón Volver contextual?
- ¿Un contenedor bg-white dentro del gradient card resolvería el P0 de raíz?

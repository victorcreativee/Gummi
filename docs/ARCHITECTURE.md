# GUMMI Architecture

## Main Services

| Service          | Purpose                                   |
| ---------------- | ----------------------------------------- |
| web              | Next.js frontend                          |
| api-gateway      | Single backend entry point                |
| auth-service     | Authentication, JWT, roles                |
| user-service     | Profiles, identity, user data             |
| talent-service   | Skills, proof-of-work, verification       |
| project-service  | Collaboration rooms and startup projects  |
| learning-service | Micro-learning sessions and workshops     |
| ai-service       | AI skill verification and recommendations |

## Infrastructure

- PostgreSQL stores core business data.
- Redis handles caching, sessions, queues, and realtime support later.
- Docker keeps local development consistent.

# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Portfolio managers need to see which wheat fields need attention. Claims reviewers need to trace a decision from temperature readings to a simulated payout. Hackathon judges need to understand the complete and repeatable flow quickly.

## Product Purpose

AgriGuard is a parametric crop-insurance prototype for wheat fields. It monitors temperature data, applies a fixed heat policy, and creates a transparent simulated payout record. The product does not issue insurance or send money.

## Positioning

AgriGuard separates a deterministic payout rule from the AI explanation. A policy engine makes the simulated payout decision from recorded observations, while the monitoring agent retrieves structured evidence and explains the result in plain English.

## Operating Context

The product is demonstrated through a portfolio dashboard, a field detail view, an evidence record, and a simulated payout ledger. The judge demo starts with field monitoring and ends with a clear, labelled evidence and payout record. A synthetic heat-wave scenario must complete this journey without external services.

## Capabilities and Constraints

The first release supports wheat only, heat stress only, three to five fields, and simulated payouts only. A qualifying event needs temperatures of at least 34 °C for three or more continuous hourly observations during flowering or grain filling. The Groq monitoring agent can use controlled server tools but cannot change policy inputs or payout results.

The FortyGuard Temperature API is pending. Until it is available, the product must use clearly labelled synthetic demo data through a swappable temperature-data adapter. Supabase has been created but does not yet contain the application schema.

## Brand Commitments

The product name is AgriGuard. Product language must be plain, specific, and cautious. Every payout amount must be called simulated. Every synthetic result must be visibly labelled. The design must be high quality without generic AI styling.

## Evidence on Hand

The approved PRD is at `docs/PRD.md`. The approved public Spline Code scene is `https://prod.spline.design/uVqm7hH8m0iJQ5iX/scene.splinecode`. The licensed Pexels asset source is documented in `docs/PREBUILD_RESEARCH.md`; its managed web asset is `/manus-storage/agriguard-aerial-fields-1280_d9fa472b.mp4`.

## Product Principles

1. Every decision must be visible and traceable.
2. Policy logic must remain deterministic, even when AI contributes an explanation.
3. A judge must understand the full product flow in under three minutes.
4. The fallback demo must be as clear as the live-data path.
5. The interface must prioritize risk clarity over decoration.

## Accessibility & Inclusion

Status uses text as well as color. Controls must be keyboard accessible and have visible focus. Reduced-motion preferences must disable non-essential animation and 3D work. The desktop dashboard must adapt to mobile without hiding essential evidence.

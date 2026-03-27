# FRED Protocol Governance

## How the Spec Evolves

The FRED Protocol is an open-source specification. It evolves through community input, transparent decision-making, and careful stewardship.

## Roles

### Spec Author
**Freddy Lim** — Created the FRED Protocol and maintains final decision authority on spec changes during the v0.x phase.

### Contributors
Anyone who submits issues, pull requests, reference implementations, or tooling. All contributors are credited in release notes.

### Reviewers
Community members invited to review proposed spec changes. Reviewers are selected based on demonstrated expertise and contribution history.

## Decision Process

### Phase 1: v0.x (Current)

During the initial development phase (v0.x), the spec author has final decision authority. This ensures the protocol can move quickly and maintain coherence while the core design solidifies.

The process for changes:

1. **Propose** — Open a GitHub Issue describing the change, the problem it solves, and any breaking implications.
2. **Discuss** — Community discussion on the issue. Minimum 7 days for non-trivial changes.
3. **Draft** — Submit a Pull Request with the proposed spec changes, updated schema, and updated examples.
4. **Review** — At least 2 community reviews before merge.
5. **Decide** — Spec author approves or requests changes, with written rationale.
6. **Release** — Merged changes are included in the next minor version.

### Phase 2: v1.0+

Once the spec reaches v1.0, governance transitions to a committee model:

- **Steering Committee** of 3-5 members (including the spec author)
- **Majority vote** for minor changes
- **Supermajority (4/5)** for breaking changes
- **Public RFC process** for major additions
- Committee members serve 2-year terms with staggered rotation

The transition to Phase 2 will be announced at least 3 months in advance.

## Types of Changes

### Patch (0.1.x)
- Typo fixes, clarifications, example corrections
- No schema changes
- Can be merged with 1 review

### Minor (0.x.0)
- New optional fields or layers
- New enum values
- Backwards-compatible additions
- Requires 2 reviews and 7-day discussion period

### Major (x.0.0)
- Breaking changes to required fields
- Removal of existing fields
- Changes to file location or discovery
- Requires public RFC, 30-day comment period, and supermajority approval (Phase 2)

## Contribution Guidelines

### Spec Changes

1. Check existing issues to avoid duplicates.
2. Open an issue before writing a PR — get alignment on the approach.
3. PRs must update: the spec (fred-spec.md), the schema (fred-schema.json), at least one example, and the validator if applicable.
4. All spec text must be clear enough that two independent implementors would produce compatible implementations.

### Reference Implementations

- New reference implementations are welcome as additions to the `examples/` directory.
- Each implementation must pass the validator at Level 1 or higher.
- Include a brief README explaining the entity and any notable patterns.

### Tooling

- Validators, generators, crawlers, and integrations in any language are welcome.
- Open a discussion issue before starting major tooling efforts to avoid duplication.
- Tooling should be contributed to separate repositories, linked from the main README.

## Code of Conduct

Contributors are expected to:
- Be respectful and constructive in all discussions.
- Focus on technical merit and user impact.
- Assume good intent.
- Disclose any conflicts of interest.

The spec author reserves the right to moderate discussions and remove disruptive participants.

## Intellectual Property

- The FRED Protocol specification is licensed under Apache 2.0.
- All contributions to the spec are made under the same license.
- Contributors retain copyright on their contributions but grant the project a perpetual, irrevocable license under Apache 2.0.
- The "FRED Protocol" name and logo are maintained by the spec author to prevent fragmentation. Use of the name for compatible implementations is encouraged.

## Versioning

The protocol follows Semantic Versioning:

- **Major** — Breaking changes (agents must update)
- **Minor** — Backwards-compatible additions (agents should update)
- **Patch** — Clarifications and fixes (no agent changes needed)

The `fred` field in fred.json uses major.minor only (e.g., "0.1"). Patch versions apply to the spec document, not to the file format.

## Contact

- **GitHub Issues** — For spec proposals, bug reports, and discussion
- **Email** — freddy@freddys.io for governance questions
- **Twitter** — @freddylim for announcements

---

*This governance document may be updated as the project grows. Changes to governance follow the same process as minor spec changes.*

## Important regular expressions:

#### Identifier

* Expression: `[_[:alpha:]][_[:alnum:]]*`
* Matches: `_`, `Ident42`

#### Type name

```
(?<type_name>
    (?:
        (?:ref\s+)?   # only in certain place with ref local/return
        (?:
            (?:(?<identifier>[_[:alpha:]][_[:alnum:]]*)\s*\:\:\s*)? # alias-qualification
            (?<name_and_type_args> # identifier + type arguments (if any)
                \g<identifier>\s*
                (?<type_args>\s*<(?:[^<>]|\g<type_args>)+>\s*)?
            )
            (?:\s*\.\s*\g<name_and_type_args>)* | # Are there any more names being dotted into?
            (?<tuple>\s*\((?:[^\(\)]|\g<tuple>)+\))
        )
        (?:\s*\*\s*)* # pointer suffix?
        (?:\s*\?\s*)? # nullable suffix?
        (?:\s*\[(?:\s*,\s*)*\]\s*)* # array suffix?
    )
)
```
## Important regular expressions:

#### Identifier

* Expression: `[_[:alpha:]][_[:alnum:]]*`
* Matches: `_`, `Ident42`

#### Type name

```
(?<type-name>
    (?:
        (?:ref\s+)?   # only in certain place with ref local/return
        (?:
            (?:(?<identifier>[_[:alpha:]][_[:alnum:]]*)\s*\:\:\s*)? # alias-qualification
            (?<name-and-type-args> # identifier + type arguments (if any)
                \g<identifier>\s*
                (?<type-args>\s*<(?:[^<>]|\g<type-args>)+>\s*)?
            )
            (?:\s*\.\s*\g<name-and-type-args>)* | # Are there any more names being dotted into?
            (?<tuple>\s*\((?:[^\(\)]|\g<tuple>)+\))
        )
        (?:\s*\*\s*)* # pointer suffix?
        (?:\s*\?\s*)? # nullable suffix?
        (?:\s* # array suffix?
            \[
              (?:\s*,\s*)* # commata for multi-dimensional arrays
            \]
            \s*
            (?:\?)? # arrays can be nullable reference types, they need a nullable suffix
            \s*
        )* 
    )
)
```
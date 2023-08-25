import { should } from "chai";
import { tokenize, Input, Token } from "./utils/tokenize";

describe("Patterns", () => {
  before(() => { should(); });

  describe("is operator", () => {
    it("Discard pattern", async () => {
      const input = Input.InMethod(`
if (var is _) { }
`);
      const tokens = await tokenize(input);

      tokens.should.deep.equal([
        Token.Keyword.Conditional.If,
        Token.Punctuation.OpenParen,
        Token.Variable.ReadWrite("var"),
        Token.Operator.Pattern.Is,
        Token.Variable.Discard,
        Token.Punctuation.CloseParen,
        Token.Punctuation.OpenBrace,
        Token.Punctuation.CloseBrace,
      ]);
    });

    it("Constant pattern", async () => {
      const input = Input.InMethod(`
if (var is 0) { }
if (var is null) { }
if (var is "") { }
if (var is true) { }
if (var is nameof(Foo)) { }
if (var is default(int)) { }
`);
      const tokens = await tokenize(input);

      tokens.should.deep.equal([
        Token.Keyword.Conditional.If,
        Token.Punctuation.OpenParen,
        Token.Variable.ReadWrite("var"),
        Token.Operator.Pattern.Is,
        Token.Literal.Numeric.Decimal("0"),
        Token.Punctuation.CloseParen,
        Token.Punctuation.OpenBrace,
        Token.Punctuation.CloseBrace,

        Token.Keyword.Conditional.If,
        Token.Punctuation.OpenParen,
        Token.Variable.ReadWrite("var"),
        Token.Operator.Pattern.Is,
        Token.Literal.Null,
        Token.Punctuation.CloseParen,
        Token.Punctuation.OpenBrace,
        Token.Punctuation.CloseBrace,

        Token.Keyword.Conditional.If,
        Token.Punctuation.OpenParen,
        Token.Variable.ReadWrite("var"),
        Token.Operator.Pattern.Is,
        Token.Punctuation.String.Begin,
        Token.Punctuation.String.End,
        Token.Punctuation.CloseParen,
        Token.Punctuation.OpenBrace,
        Token.Punctuation.CloseBrace,

        Token.Keyword.Conditional.If,
        Token.Punctuation.OpenParen,
        Token.Variable.ReadWrite("var"),
        Token.Operator.Pattern.Is,
        Token.Literal.Boolean.True,
        Token.Punctuation.CloseParen,
        Token.Punctuation.OpenBrace,
        Token.Punctuation.CloseBrace,

        Token.Keyword.Conditional.If,
        Token.Punctuation.OpenParen,
        Token.Variable.ReadWrite("var"),
        Token.Operator.Pattern.Is,
        Token.Operator.Expression.NameOf,
        Token.Punctuation.OpenParen,
        Token.Variable.ReadWrite("Foo"),
        Token.Punctuation.CloseParen,
        Token.Punctuation.CloseParen,
        Token.Punctuation.OpenBrace,
        Token.Punctuation.CloseBrace,

        Token.Keyword.Conditional.If,
        Token.Punctuation.OpenParen,
        Token.Variable.ReadWrite("var"),
        Token.Operator.Pattern.Is,
        Token.Operator.Expression.Default,
        Token.Punctuation.OpenParen,
        Token.PrimitiveType.Int,
        Token.Punctuation.CloseParen,
        Token.Punctuation.CloseParen,
        Token.Punctuation.OpenBrace,
        Token.Punctuation.CloseBrace,
      ]);
    });

    it("Relational pattern", async () => {
      const input = Input.InMethod(`
if (var is > 0) { }
if (var is < 0) { }
if (var is >= 0) { }
if (var is <= 0) { }
`);
      const tokens = await tokenize(input);

      tokens.should.deep.equal([
        Token.Keyword.Conditional.If,
        Token.Punctuation.OpenParen,
        Token.Variable.ReadWrite("var"),
        Token.Operator.Pattern.Is,
        Token.Operator.Relational.GreaterThan,
        Token.Literal.Numeric.Decimal("0"),
        Token.Punctuation.CloseParen,
        Token.Punctuation.OpenBrace,
        Token.Punctuation.CloseBrace,

        Token.Keyword.Conditional.If,
        Token.Punctuation.OpenParen,
        Token.Variable.ReadWrite("var"),
        Token.Operator.Pattern.Is,
        Token.Operator.Relational.LessThan,
        Token.Literal.Numeric.Decimal("0"),
        Token.Punctuation.CloseParen,
        Token.Punctuation.OpenBrace,
        Token.Punctuation.CloseBrace,

        Token.Keyword.Conditional.If,
        Token.Punctuation.OpenParen,
        Token.Variable.ReadWrite("var"),
        Token.Operator.Pattern.Is,
        Token.Operator.Relational.GreaterThanOrEqual,
        Token.Literal.Numeric.Decimal("0"),
        Token.Punctuation.CloseParen,
        Token.Punctuation.OpenBrace,
        Token.Punctuation.CloseBrace,

        Token.Keyword.Conditional.If,
        Token.Punctuation.OpenParen,
        Token.Variable.ReadWrite("var"),
        Token.Operator.Pattern.Is,
        Token.Operator.Relational.LessThanOrEqual,
        Token.Literal.Numeric.Decimal("0"),
        Token.Punctuation.CloseParen,
        Token.Punctuation.OpenBrace,
        Token.Punctuation.CloseBrace,
      ]);
    });

    it("Declaration pattern", async () => {
      const input = Input.InMethod(`
if (var is string str) { }
if (var is List<int> list) { }
if (var is int[,] arr) { }
if (var is Dictionary<string, List<int>> dict) { }
`);
      const tokens = await tokenize(input);

      tokens.should.deep.equal([
        Token.Keyword.Conditional.If,
        Token.Punctuation.OpenParen,
        Token.Variable.ReadWrite("var"),
        Token.Operator.Pattern.Is,
        Token.PrimitiveType.String,
        Token.Identifier.LocalName("str"),
        Token.Punctuation.CloseParen,
        Token.Punctuation.OpenBrace,
        Token.Punctuation.CloseBrace,

        Token.Keyword.Conditional.If,
        Token.Punctuation.OpenParen,
        Token.Variable.ReadWrite("var"),
        Token.Operator.Pattern.Is,
        Token.Type("List"),
        Token.Punctuation.TypeParameter.Begin,
        Token.PrimitiveType.Int,
        Token.Punctuation.TypeParameter.End,
        Token.Identifier.LocalName("list"),
        Token.Punctuation.CloseParen,
        Token.Punctuation.OpenBrace,
        Token.Punctuation.CloseBrace,

        Token.Keyword.Conditional.If,
        Token.Punctuation.OpenParen,
        Token.Variable.ReadWrite("var"),
        Token.Operator.Pattern.Is,
        Token.PrimitiveType.Int,
        Token.Punctuation.OpenBracket,
        Token.Punctuation.Comma,
        Token.Punctuation.CloseBracket,
        Token.Identifier.LocalName("arr"),
        Token.Punctuation.CloseParen,
        Token.Punctuation.OpenBrace,
        Token.Punctuation.CloseBrace,

        Token.Keyword.Conditional.If,
        Token.Punctuation.OpenParen,
        Token.Variable.ReadWrite("var"),
        Token.Operator.Pattern.Is,
        Token.Type("Dictionary"),
        Token.Punctuation.TypeParameter.Begin,
        Token.PrimitiveType.String,
        Token.Punctuation.Comma,
        Token.Type("List"),
        Token.Punctuation.TypeParameter.Begin,
        Token.PrimitiveType.Int,
        Token.Punctuation.TypeParameter.End,
        Token.Punctuation.TypeParameter.End,
        Token.Identifier.LocalName("dict"),
        Token.Punctuation.CloseParen,
        Token.Punctuation.OpenBrace,
        Token.Punctuation.CloseBrace,
      ]);
    });

    it("var pattern", async () => {
      const input = Input.InMethod(`
if (var is var var) { }
if (var is var (var, var)) { }
if (var is var _) { }
if (var is var (var, _)) { }
`);
      const tokens = await tokenize(input);

      tokens.should.deep.equal([
        Token.Keyword.Conditional.If,
        Token.Punctuation.OpenParen,
        Token.Variable.ReadWrite("var"),
        Token.Operator.Pattern.Is,
        Token.Keyword.Definition.Var,
        Token.Identifier.LocalName("var"),
        Token.Punctuation.CloseParen,
        Token.Punctuation.OpenBrace,
        Token.Punctuation.CloseBrace,

        Token.Keyword.Conditional.If,
        Token.Punctuation.OpenParen,
        Token.Variable.ReadWrite("var"),
        Token.Operator.Pattern.Is,
        Token.Keyword.Definition.Var,
        Token.Punctuation.OpenParen,
        Token.Identifier.LocalName("var"),
        Token.Punctuation.Comma,
        Token.Identifier.LocalName("var"),
        Token.Punctuation.CloseParen,
        Token.Punctuation.CloseParen,
        Token.Punctuation.OpenBrace,
        Token.Punctuation.CloseBrace,

        Token.Keyword.Conditional.If,
        Token.Punctuation.OpenParen,
        Token.Variable.ReadWrite("var"),
        Token.Operator.Pattern.Is,
        Token.Keyword.Definition.Var,
        Token.Variable.Discard,
        Token.Punctuation.CloseParen,
        Token.Punctuation.OpenBrace,
        Token.Punctuation.CloseBrace,

        Token.Keyword.Conditional.If,
        Token.Punctuation.OpenParen,
        Token.Variable.ReadWrite("var"),
        Token.Operator.Pattern.Is,
        Token.Keyword.Definition.Var,
        Token.Punctuation.OpenParen,
        Token.Identifier.LocalName("var"),
        Token.Punctuation.Comma,
        Token.Variable.Discard,
        Token.Punctuation.CloseParen,
        Token.Punctuation.CloseParen,
        Token.Punctuation.OpenBrace,
        Token.Punctuation.CloseBrace,
      ]);
    });

    it("Type pattern", async () => {
      const input = Input.InMethod(`
result = obj is string;
result = obj is List<int>;
result = obj is int[,];
result = obj is Dictionary<string, List<int>>;
`);
      const tokens = await tokenize(input);

      tokens.should.deep.equal([
        Token.Variable.ReadWrite("result"),
        Token.Operator.Assignment,
        Token.Variable.ReadWrite("obj"),
        Token.Operator.Pattern.Is,
        Token.PrimitiveType.String,
        Token.Punctuation.Semicolon,

        Token.Variable.ReadWrite("result"),
        Token.Operator.Assignment,
        Token.Variable.ReadWrite("obj"),
        Token.Operator.Pattern.Is,
        Token.Type("List"),
        Token.Punctuation.TypeParameter.Begin,
        Token.PrimitiveType.Int,
        Token.Punctuation.TypeParameter.End,
        Token.Punctuation.Semicolon,

        Token.Variable.ReadWrite("result"),
        Token.Operator.Assignment,
        Token.Variable.ReadWrite("obj"),
        Token.Operator.Pattern.Is,
        Token.PrimitiveType.Int,
        Token.Punctuation.OpenBracket,
        Token.Punctuation.Comma,
        Token.Punctuation.CloseBracket,
        Token.Punctuation.Semicolon,

        Token.Variable.ReadWrite("result"),
        Token.Operator.Assignment,
        Token.Variable.ReadWrite("obj"),
        Token.Operator.Pattern.Is,
        Token.Type("Dictionary"),
        Token.Punctuation.TypeParameter.Begin,
        Token.PrimitiveType.String,
        Token.Punctuation.Comma,
        Token.Type("List"),
        Token.Punctuation.TypeParameter.Begin,
        Token.PrimitiveType.Int,
        Token.Punctuation.TypeParameter.End,
        Token.Punctuation.TypeParameter.End,
        Token.Punctuation.Semicolon,
      ]);
    });

    it("Positional sub-pattern", async () => {
      const input = Input.InMethod(`
result = (a, b, c, d, e) is
(
  _,
  null,
  c: > 3,
  string str,
  e: List<object>,
);`);
      const tokens = await tokenize(input);

      tokens.should.deep.equal([
        Token.Variable.ReadWrite("result"),
        Token.Operator.Assignment,
        Token.Punctuation.OpenParen,
        Token.Variable.ReadWrite("a"),
        Token.Punctuation.Comma,
        Token.Variable.ReadWrite("b"),
        Token.Punctuation.Comma,
        Token.Variable.ReadWrite("c"),
        Token.Punctuation.Comma,
        Token.Variable.ReadWrite("d"),
        Token.Punctuation.Comma,
        Token.Variable.ReadWrite("e"),
        Token.Punctuation.CloseParen,
        Token.Operator.Pattern.Is,
        Token.Punctuation.OpenParen,

        Token.Variable.Discard,
        Token.Punctuation.Comma,

        Token.Literal.Null,
        Token.Punctuation.Comma,

        Token.Variable.Property("c"),
        Token.Punctuation.Colon,
        Token.Operator.Relational.GreaterThan,
        Token.Literal.Numeric.Decimal("3"),
        Token.Punctuation.Comma,

        Token.PrimitiveType.String,
        Token.Identifier.LocalName("str"),
        Token.Punctuation.Comma,

        Token.Variable.Property("e"),
        Token.Punctuation.Colon,
        Token.Type("List"),
        Token.Punctuation.TypeParameter.Begin,
        Token.PrimitiveType.Object,
        Token.Punctuation.TypeParameter.End,
        Token.Punctuation.Comma,

        Token.Punctuation.CloseParen,
        Token.Punctuation.Semicolon,
      ]);
    });

    it("Positional pattern", async () => {
      const input = Input.InMethod(`
if (x is Foo.Bar(int, not null) { Data.Length: > 0 } y) { }
`);
      const tokens = await tokenize(input);

      tokens.should.deep.equal([
        Token.Keyword.Conditional.If,
        Token.Punctuation.OpenParen,
        Token.Variable.ReadWrite("x"),
        Token.Operator.Pattern.Is,
        Token.Type("Foo"),
        Token.Punctuation.Accessor,
        Token.Type("Bar"),
        Token.Punctuation.OpenParen,
        Token.PrimitiveType.Int,
        Token.Punctuation.Comma,
        Token.Operator.Pattern.Not,
        Token.Literal.Null,
        Token.Punctuation.CloseParen,
        Token.Punctuation.OpenBrace,
        Token.Variable.Property("Data"),
        Token.Punctuation.Accessor,
        Token.Variable.Property("Length"),
        Token.Punctuation.Colon,
        Token.Operator.Relational.GreaterThan,
        Token.Literal.Numeric.Decimal("0"),
        Token.Punctuation.CloseBrace,
        Token.Identifier.LocalName("y"),
        Token.Punctuation.CloseParen,
        Token.Punctuation.OpenBrace,
        Token.Punctuation.CloseBrace,
      ]);
    });

    it("Property sub-pattern", async () => {
      const input = Input.InMethod(`
if (f is { IsPreRelease: false, FileName.Length: > 3 and < 10 }) { }
`);
      const tokens = await tokenize(input);

      tokens.should.deep.equal([
        Token.Keyword.Conditional.If,
        Token.Punctuation.OpenParen,
        Token.Variable.ReadWrite("f"),
        Token.Operator.Pattern.Is,
        Token.Punctuation.OpenBrace,
        Token.Variable.Property("IsPreRelease"),
        Token.Punctuation.Colon,
        Token.Literal.Boolean.False,
        Token.Punctuation.Comma,
        Token.Variable.Property("FileName"),
        Token.Punctuation.Accessor,
        Token.Variable.Property("Length"),
        Token.Punctuation.Colon,
        Token.Operator.Relational.GreaterThan,
        Token.Literal.Numeric.Decimal("3"),
        Token.Operator.Pattern.And,
        Token.Operator.Relational.LessThan,
        Token.Literal.Numeric.Decimal("10"),
        Token.Punctuation.CloseBrace,
        Token.Punctuation.CloseParen,
        Token.Punctuation.OpenBrace,
        Token.Punctuation.CloseBrace,
      ]);
    });

    it("Property pattern", async () => {
      const input = Input.InMethod(`
if (o is string { Length: 5 } s) { }
if (f is System.Diagnostics.FileVersionInfo { IsPreRelease: false, FileName.Length: > 3 and < 10 }) { }
if (v is System.Version { Major: >= 10 }) { }
`);
      const tokens = await tokenize(input);

      tokens.should.deep.equal([
        Token.Keyword.Conditional.If,
        Token.Punctuation.OpenParen,
        Token.Variable.ReadWrite("o"),
        Token.Operator.Pattern.Is,
        Token.PrimitiveType.String,
        Token.Punctuation.OpenBrace,
        Token.Variable.Property("Length"),
        Token.Punctuation.Colon,
        Token.Literal.Numeric.Decimal("5"),
        Token.Punctuation.CloseBrace,
        Token.Identifier.LocalName("s"),
        Token.Punctuation.CloseParen,
        Token.Punctuation.OpenBrace,
        Token.Punctuation.CloseBrace,

        Token.Keyword.Conditional.If,
        Token.Punctuation.OpenParen,
        Token.Variable.ReadWrite("f"),
        Token.Operator.Pattern.Is,
        Token.Type("System"),
        Token.Punctuation.Accessor,
        Token.Type("Diagnostics"),
        Token.Punctuation.Accessor,
        Token.Type("FileVersionInfo"),
        Token.Punctuation.OpenBrace,
        Token.Variable.Property("IsPreRelease"),
        Token.Punctuation.Colon,
        Token.Literal.Boolean.False,
        Token.Punctuation.Comma,
        Token.Variable.Property("FileName"),
        Token.Punctuation.Accessor,
        Token.Variable.Property("Length"),
        Token.Punctuation.Colon,
        Token.Operator.Relational.GreaterThan,
        Token.Literal.Numeric.Decimal("3"),
        Token.Operator.Pattern.And,
        Token.Operator.Relational.LessThan,
        Token.Literal.Numeric.Decimal("10"),
        Token.Punctuation.CloseBrace,
        Token.Punctuation.CloseParen,
        Token.Punctuation.OpenBrace,
        Token.Punctuation.CloseBrace,

        Token.Keyword.Conditional.If,
        Token.Punctuation.OpenParen,
        Token.Variable.ReadWrite("v"),
        Token.Operator.Pattern.Is,
        Token.Type("System"),
        Token.Punctuation.Accessor,
        Token.Type("Version"),
        Token.Punctuation.OpenBrace,
        Token.Variable.Property("Major"),
        Token.Punctuation.Colon,
        Token.Operator.Relational.GreaterThanOrEqual,
        Token.Literal.Numeric.Decimal("10"),
        Token.Punctuation.CloseBrace,
        Token.Punctuation.CloseParen,
        Token.Punctuation.OpenBrace,
        Token.Punctuation.CloseBrace,
      ]);
    });

    it("List pattern", async () => {
      const input = Input.InMethod(`
if (array is [1, 2, 3] x) { }
`);
      const tokens = await tokenize(input);

      tokens.should.deep.equal([
        Token.Keyword.Conditional.If,
        Token.Punctuation.OpenParen,
        Token.Variable.ReadWrite("array"),
        Token.Operator.Pattern.Is,
        Token.Punctuation.OpenBracket,
        Token.Literal.Numeric.Decimal("1"),
        Token.Punctuation.Comma,
        Token.Literal.Numeric.Decimal("2"),
        Token.Punctuation.Comma,
        Token.Literal.Numeric.Decimal("3"),
        Token.Punctuation.CloseBracket,
        Token.Identifier.LocalName("x"),
        Token.Punctuation.CloseParen,
        Token.Punctuation.OpenBrace,
        Token.Punctuation.CloseBrace,
      ]);
    });

    it("Slice pattern", async () => {
      const input = Input.InMethod(`
result = array is [_, 1, ..{ Length: > 0 }];
`);
      const tokens = await tokenize(input);

      tokens.should.deep.equal([
        Token.Variable.ReadWrite("result"),
        Token.Operator.Assignment,
        Token.Variable.ReadWrite("array"),
        Token.Operator.Pattern.Is,
        Token.Punctuation.OpenBracket,
        Token.Variable.Discard,
        Token.Punctuation.Comma,
        Token.Literal.Numeric.Decimal("1"),
        Token.Punctuation.Comma,
        Token.Operator.Range,
        Token.Punctuation.OpenBrace,
        Token.Variable.Property("Length"),
        Token.Punctuation.Colon,
        Token.Operator.Relational.GreaterThan,
        Token.Literal.Numeric.Decimal("0"),
        Token.Punctuation.CloseBrace,
        Token.Punctuation.CloseBracket,
        Token.Punctuation.Semicolon,
      ]);
    });

    it("Pattern combinators", async () => {
      const input = Input.InMethod(`
result = c is
    >= 'a' and
    <= 'z' or
    >= 'A' and
    <= 'Z';
`);
      const tokens = await tokenize(input);

      tokens.should.deep.equal([
        Token.Variable.ReadWrite("result"),
        Token.Operator.Assignment,
        Token.Variable.ReadWrite("c"),
        Token.Operator.Pattern.Is,
        Token.Operator.Relational.GreaterThanOrEqual,
        Token.Punctuation.Char.Begin,
        Token.Literal.Char("a"),
        Token.Punctuation.Char.End,
        Token.Operator.Pattern.And,
        Token.Operator.Relational.LessThanOrEqual,
        Token.Punctuation.Char.Begin,
        Token.Literal.Char("z"),
        Token.Punctuation.Char.End,
        Token.Operator.Pattern.Or,
        Token.Operator.Relational.GreaterThanOrEqual,
        Token.Punctuation.Char.Begin,
        Token.Literal.Char("A"),
        Token.Punctuation.Char.End,
        Token.Operator.Pattern.And,
        Token.Operator.Relational.LessThanOrEqual,
        Token.Punctuation.Char.Begin,
        Token.Literal.Char("Z"),
        Token.Punctuation.Char.End,
        Token.Punctuation.Semicolon,
      ]);
    });

    it("Parenthesized pattern", async () => {
      const input = Input.InMethod(`
result = c is
    (>= 'a' and <= 'z') or
    (>= 'A' and <= 'Z');
`);
      const tokens = await tokenize(input);

      tokens.should.deep.equal([
        Token.Variable.ReadWrite("result"),
        Token.Operator.Assignment,
        Token.Variable.ReadWrite("c"),
        Token.Operator.Pattern.Is,
        Token.Punctuation.OpenParen,
        Token.Operator.Relational.GreaterThanOrEqual,
        Token.Punctuation.Char.Begin,
        Token.Literal.Char("a"),
        Token.Punctuation.Char.End,
        Token.Operator.Pattern.And,
        Token.Operator.Relational.LessThanOrEqual,
        Token.Punctuation.Char.Begin,
        Token.Literal.Char("z"),
        Token.Punctuation.Char.End,
        Token.Punctuation.CloseParen,
        Token.Operator.Pattern.Or,
        Token.Punctuation.OpenParen,
        Token.Operator.Relational.GreaterThanOrEqual,
        Token.Punctuation.Char.Begin,
        Token.Literal.Char("A"),
        Token.Punctuation.Char.End,
        Token.Operator.Pattern.And,
        Token.Operator.Relational.LessThanOrEqual,
        Token.Punctuation.Char.Begin,
        Token.Literal.Char("Z"),
        Token.Punctuation.Char.End,
        Token.Punctuation.CloseParen,
        Token.Punctuation.Semicolon,
      ]);
    });
  });

  describe("switch statement", () => {
    it("Supports all patterns", async () => {
      const input = Input.InMethod(`
switch (allPatterns)
{
  case (>= 'a' and <= 'z') or (>= 'A' and <= 'Z'):
  case >= 0 and <= 9 or >= 20 and <= 29:
  case [_, 1, ..{ Length: > 0 }]:
  case [1, 2, 3] x:
  case string { Length: 5 } s:
  case { IsPreRelease: false, FileName.Length: > 3 and < 10 }:
  case Foo.Bar (int, not null) { Data.Length: > 0 } y:
  case (_, null, c: > 3, string str, e: List<object>, ):
  case Dictionary<string, List<int>>:
  case int[,] arr:
  case > 0:
  case null:
  case _:
    break;
}`);
      const tokens = await tokenize(input);

      tokens.should.deep.equal([
        Token.Keyword.Conditional.Switch,
        Token.Punctuation.OpenParen,
        Token.Variable.ReadWrite("allPatterns"),
        Token.Punctuation.CloseParen,
        Token.Punctuation.OpenBrace,

        Token.Keyword.Conditional.Case,
        Token.Punctuation.OpenParen,
        Token.Operator.Relational.GreaterThanOrEqual,
        Token.Punctuation.Char.Begin,
        Token.Literal.Char("a"),
        Token.Punctuation.Char.End,
        Token.Operator.Pattern.And,
        Token.Operator.Relational.LessThanOrEqual,
        Token.Punctuation.Char.Begin,
        Token.Literal.Char("z"),
        Token.Punctuation.Char.End,
        Token.Punctuation.CloseParen,
        Token.Operator.Pattern.Or,
        Token.Punctuation.OpenParen,
        Token.Operator.Relational.GreaterThanOrEqual,
        Token.Punctuation.Char.Begin,
        Token.Literal.Char("A"),
        Token.Punctuation.Char.End,
        Token.Operator.Pattern.And,
        Token.Operator.Relational.LessThanOrEqual,
        Token.Punctuation.Char.Begin,
        Token.Literal.Char("Z"),
        Token.Punctuation.Char.End,
        Token.Punctuation.CloseParen,
        Token.Punctuation.Colon,

        Token.Keyword.Conditional.Case,
        Token.Operator.Relational.GreaterThanOrEqual,
        Token.Literal.Numeric.Decimal("0"),
        Token.Operator.Pattern.And,
        Token.Operator.Relational.LessThanOrEqual,
        Token.Literal.Numeric.Decimal("9"),
        Token.Operator.Pattern.Or,
        Token.Operator.Relational.GreaterThanOrEqual,
        Token.Literal.Numeric.Decimal("20"),
        Token.Operator.Pattern.And,
        Token.Operator.Relational.LessThanOrEqual,
        Token.Literal.Numeric.Decimal("29"),
        Token.Punctuation.Colon,

        Token.Keyword.Conditional.Case,
        Token.Punctuation.OpenBracket,
        Token.Variable.Discard,
        Token.Punctuation.Comma,
        Token.Literal.Numeric.Decimal("1"),
        Token.Punctuation.Comma,
        Token.Operator.Range,
        Token.Punctuation.OpenBrace,
        Token.Variable.Property("Length"),
        Token.Punctuation.Colon,
        Token.Operator.Relational.GreaterThan,
        Token.Literal.Numeric.Decimal("0"),
        Token.Punctuation.CloseBrace,
        Token.Punctuation.CloseBracket,
        Token.Punctuation.Colon,

        Token.Keyword.Conditional.Case,
        Token.Punctuation.OpenBracket,
        Token.Literal.Numeric.Decimal("1"),
        Token.Punctuation.Comma,
        Token.Literal.Numeric.Decimal("2"),
        Token.Punctuation.Comma,
        Token.Literal.Numeric.Decimal("3"),
        Token.Punctuation.CloseBracket,
        Token.Identifier.LocalName("x"),
        Token.Punctuation.Colon,

        Token.Keyword.Conditional.Case,
        Token.PrimitiveType.String,
        Token.Punctuation.OpenBrace,
        Token.Variable.Property("Length"),
        Token.Punctuation.Colon,
        Token.Literal.Numeric.Decimal("5"),
        Token.Punctuation.CloseBrace,
        Token.Identifier.LocalName("s"),
        Token.Punctuation.Colon,

        Token.Keyword.Conditional.Case,
        Token.Punctuation.OpenBrace,
        Token.Variable.Property("IsPreRelease"),
        Token.Punctuation.Colon,
        Token.Literal.Boolean.False,
        Token.Punctuation.Comma,
        Token.Variable.Property("FileName"),
        Token.Punctuation.Accessor,
        Token.Variable.Property("Length"),
        Token.Punctuation.Colon,
        Token.Operator.Relational.GreaterThan,
        Token.Literal.Numeric.Decimal("3"),
        Token.Operator.Pattern.And,
        Token.Operator.Relational.LessThan,
        Token.Literal.Numeric.Decimal("10"),
        Token.Punctuation.CloseBrace,
        Token.Punctuation.Colon,

        Token.Keyword.Conditional.Case,
        Token.Type("Foo"),
        Token.Punctuation.Accessor,
        Token.Type("Bar"),
        Token.Punctuation.OpenParen,
        Token.PrimitiveType.Int,
        Token.Punctuation.Comma,
        Token.Operator.Pattern.Not,
        Token.Literal.Null,
        Token.Punctuation.CloseParen,
        Token.Punctuation.OpenBrace,
        Token.Variable.Property("Data"),
        Token.Punctuation.Accessor,
        Token.Variable.Property("Length"),
        Token.Punctuation.Colon,
        Token.Operator.Relational.GreaterThan,
        Token.Literal.Numeric.Decimal("0"),
        Token.Punctuation.CloseBrace,
        Token.Identifier.LocalName("y"),
        Token.Punctuation.Colon,

        Token.Keyword.Conditional.Case,
        Token.Punctuation.OpenParen,
        Token.Variable.Discard,
        Token.Punctuation.Comma,
        Token.Literal.Null,
        Token.Punctuation.Comma,
        Token.Variable.Property("c"),
        Token.Punctuation.Colon,
        Token.Operator.Relational.GreaterThan,
        Token.Literal.Numeric.Decimal("3"),
        Token.Punctuation.Comma,
        Token.PrimitiveType.String,
        Token.Identifier.LocalName("str"),
        Token.Punctuation.Comma,
        Token.Variable.Property("e"),
        Token.Punctuation.Colon,
        Token.Type("List"),
        Token.Punctuation.TypeParameter.Begin,
        Token.PrimitiveType.Object,
        Token.Punctuation.TypeParameter.End,
        Token.Punctuation.Comma,
        Token.Punctuation.CloseParen,
        Token.Punctuation.Colon,

        Token.Keyword.Conditional.Case,
        Token.Type("Dictionary"),
        Token.Punctuation.TypeParameter.Begin,
        Token.PrimitiveType.String,
        Token.Punctuation.Comma,
        Token.Type("List"),
        Token.Punctuation.TypeParameter.Begin,
        Token.PrimitiveType.Int,
        Token.Punctuation.TypeParameter.End,
        Token.Punctuation.TypeParameter.End,
        Token.Punctuation.Colon,

        Token.Keyword.Conditional.Case,
        Token.PrimitiveType.Int,
        Token.Punctuation.OpenBracket,
        Token.Punctuation.Comma,
        Token.Punctuation.CloseBracket,
        Token.Identifier.LocalName("arr"),
        Token.Punctuation.Colon,

        Token.Keyword.Conditional.Case,
        Token.Operator.Relational.GreaterThan,
        Token.Literal.Numeric.Decimal("0"),
        Token.Punctuation.Colon,

        Token.Keyword.Conditional.Case,
        Token.Literal.Null,
        Token.Punctuation.Colon,

        Token.Keyword.Conditional.Case,
        Token.Variable.Discard,
        Token.Punctuation.Colon,

        Token.Keyword.Flow.Break,
        Token.Punctuation.Semicolon,
        Token.Punctuation.CloseBrace,
      ]);
    })

    it("when clause", async () => {
      const input = Input.InMethod(`
switch (a)
{
    case string str when str.Length is > 3 and not > 8: break;
    case var (x, y) when x is not null && y is int: break;
}`);
      const tokens = await tokenize(input);

      tokens.should.deep.equal([
        Token.Keyword.Conditional.Switch,
        Token.Punctuation.OpenParen,
        Token.Variable.ReadWrite("a"),
        Token.Punctuation.CloseParen,
        Token.Punctuation.OpenBrace,
        Token.Keyword.Conditional.Case,
        Token.PrimitiveType.String,
        Token.Identifier.LocalName("str"),
        Token.Keyword.Conditional.When,
        Token.Variable.Object("str"),
        Token.Punctuation.Accessor,
        Token.Variable.Property("Length"),
        Token.Operator.Pattern.Is,
        Token.Operator.Relational.GreaterThan,
        Token.Literal.Numeric.Decimal("3"),
        Token.Operator.Pattern.And,
        Token.Operator.Pattern.Not,
        Token.Operator.Relational.GreaterThan,
        Token.Literal.Numeric.Decimal("8"),
        Token.Punctuation.Colon,
        Token.Keyword.Flow.Break,
        Token.Punctuation.Semicolon,

        Token.Keyword.Conditional.Case,
        Token.Keyword.Definition.Var,
        Token.Punctuation.OpenParen,
        Token.Identifier.LocalName("x"),
        Token.Punctuation.Comma,
        Token.Identifier.LocalName("y"),
        Token.Punctuation.CloseParen,
        Token.Keyword.Conditional.When,
        Token.Variable.ReadWrite("x"),
        Token.Operator.Pattern.Is,
        Token.Operator.Pattern.Not,
        Token.Literal.Null,
        Token.Operator.Logical.And,
        Token.Variable.ReadWrite("y"),
        Token.Operator.Pattern.Is,
        Token.PrimitiveType.Int,
        Token.Punctuation.Colon,
        Token.Keyword.Flow.Break,
        Token.Punctuation.Semicolon,

        Token.Punctuation.CloseBrace,
      ]);
    });

    it("Handles line breaks", async () => {
      const input = Input.InMethod(`
switch (a)
{
  case
    string?
    str
    when
    str
    .Length
    is
    >
    3
    and
    not
    >
    8
    : break;
  case
    ""
    or
    null
    or
    0
    : break;
  case
    {
      Length:
        >
        8
        or
        <=
        2
    }
    : break;
  case
    (
      first:
        int,
      {
        A:
          not
          null,
        B.C:
          string
      }
    )
    : break;
  case
    global ::
    System
    .
    Collections
    .
    Generic
    .
    List
    <
      int
    >
    [
    ]
    : break;
}`);
      const tokens = await tokenize(input);

      tokens.should.deep.equal([
        Token.Keyword.Conditional.Switch,
        Token.Punctuation.OpenParen,
        Token.Variable.ReadWrite("a"),
        Token.Punctuation.CloseParen,
        Token.Punctuation.OpenBrace,

        Token.Keyword.Conditional.Case,
        Token.PrimitiveType.String,
        Token.Punctuation.QuestionMark,
        Token.Identifier.LocalName("str"),
        Token.Keyword.Conditional.When,
        Token.Variable.ReadWrite("str"),
        Token.Punctuation.Accessor,
        Token.Variable.Property("Length"),
        Token.Operator.Pattern.Is,
        Token.Operator.Relational.GreaterThan,
        Token.Literal.Numeric.Decimal("3"),
        Token.Operator.Pattern.And,
        Token.Operator.Pattern.Not,
        Token.Operator.Relational.GreaterThan,
        Token.Literal.Numeric.Decimal("8"),
        Token.Punctuation.Colon,
        Token.Keyword.Flow.Break,
        Token.Punctuation.Semicolon,

        Token.Keyword.Conditional.Case,
        Token.Punctuation.String.Begin,
        Token.Punctuation.String.End,
        Token.Operator.Pattern.Or,
        Token.Literal.Null,
        Token.Operator.Pattern.Or,
        Token.Literal.Numeric.Decimal("0"),
        Token.Punctuation.Colon,
        Token.Keyword.Flow.Break,
        Token.Punctuation.Semicolon,

        Token.Keyword.Conditional.Case,
        Token.Punctuation.OpenBrace,
        Token.Variable.Property("Length"),
        Token.Punctuation.Colon,
        Token.Operator.Relational.GreaterThan,
        Token.Literal.Numeric.Decimal("8"),
        Token.Operator.Pattern.Or,
        Token.Operator.Relational.LessThanOrEqual,
        Token.Literal.Numeric.Decimal("2"),
        Token.Punctuation.CloseBrace,
        Token.Punctuation.Colon,
        Token.Keyword.Flow.Break,
        Token.Punctuation.Semicolon,

        Token.Keyword.Conditional.Case,
        Token.Punctuation.OpenParen,
        Token.Variable.Property("first"),
        Token.Punctuation.Colon,
        Token.PrimitiveType.Int,
        Token.Punctuation.Comma,
        Token.Punctuation.OpenBrace,
        Token.Variable.Property("A"),
        Token.Punctuation.Colon,
        Token.Operator.Pattern.Not,
        Token.Literal.Null,
        Token.Punctuation.Comma,
        Token.Variable.Property("B"),
        Token.Punctuation.Accessor,
        Token.Variable.Property("C"),
        Token.Punctuation.Colon,
        Token.PrimitiveType.String,
        Token.Punctuation.CloseBrace,
        Token.Punctuation.CloseParen,
        Token.Punctuation.Colon,
        Token.Keyword.Flow.Break,
        Token.Punctuation.Semicolon,

        Token.Keyword.Conditional.Case,
        Token.Identifier.AliasName("global"),
        Token.Punctuation.ColonColon,
        Token.Type("System"),
        Token.Punctuation.Accessor,
        Token.Type("Collections"),
        Token.Punctuation.Accessor,
        Token.Type("Generic"),
        Token.Punctuation.Accessor,
        Token.Type("List"),
        Token.Punctuation.TypeParameter.Begin,
        Token.PrimitiveType.Int,
        Token.Punctuation.TypeParameter.End,
        Token.Punctuation.OpenBracket,
        Token.Punctuation.CloseBracket,
        Token.Punctuation.Colon,
        Token.Keyword.Flow.Break,
        Token.Punctuation.Semicolon,

        Token.Punctuation.CloseBrace,
      ]);
    });
  });

  describe("switch expression", () => {
    it("Declaration, constant, discard patterns", async () => {
      const input = Input.InClass(`
public decimal Calculate(object thing) =>
  thing switch
  {
      Car c => 2.00m - 1.0m,
      Bus b when ((double)b.Riders / (double)b.Capacity) < 0.50 => 5.00m + 2.00m,
      Bus b => 5.00m,
      { }  => throw new ArgumentException(message: "Not a known vehicle type", paramName: nameof(vehicle)),
      null => throw new ArgumentNullException(nameof(vehicle)),
      _ => 3.50m - 1.00m,
  };`);
      const tokens = await tokenize(input);

      tokens.should.deep.equal([
        Token.Keyword.Modifier.Public,
        Token.PrimitiveType.Decimal,
        Token.Identifier.MethodName("Calculate"),
        Token.Punctuation.OpenParen,
        Token.PrimitiveType.Object,
        Token.Identifier.ParameterName("thing"),
        Token.Punctuation.CloseParen,
        Token.Operator.Arrow,
        Token.Variable.ReadWrite("thing"),
        Token.Keyword.Conditional.Switch,
        Token.Punctuation.OpenBrace,
        Token.Type("Car"),
        Token.Identifier.LocalName("c"),
        Token.Operator.Arrow,
        Token.Literal.Numeric.Decimal("2"),
        Token.Literal.Numeric.Other.Separator.Decimals,
        Token.Literal.Numeric.Decimal("00"),
        Token.Literal.Numeric.Other.Suffix("m"),
        Token.Operator.Arithmetic.Subtraction,
        Token.Literal.Numeric.Decimal("1"),
        Token.Literal.Numeric.Other.Separator.Decimals,
        Token.Literal.Numeric.Decimal("0"),
        Token.Literal.Numeric.Other.Suffix("m"),
        Token.Punctuation.Comma,
        Token.Type("Bus"),
        Token.Identifier.LocalName("b"),
        Token.Keyword.Conditional.When,
        Token.Punctuation.OpenParen,
        Token.Punctuation.OpenParen,
        Token.PrimitiveType.Double,
        Token.Punctuation.CloseParen,
        Token.Variable.Object("b"),
        Token.Punctuation.Accessor,
        Token.Variable.Property("Riders"),
        Token.Operator.Arithmetic.Division,
        Token.Punctuation.OpenParen,
        Token.PrimitiveType.Double,
        Token.Punctuation.CloseParen,
        Token.Variable.Object("b"),
        Token.Punctuation.Accessor,
        Token.Variable.Property("Capacity"),
        Token.Punctuation.CloseParen,
        Token.Operator.Relational.LessThan,
        Token.Literal.Numeric.Decimal("0"),
        Token.Literal.Numeric.Other.Separator.Decimals,
        Token.Literal.Numeric.Decimal("50"),
        Token.Operator.Arrow,
        Token.Literal.Numeric.Decimal("5"),
        Token.Literal.Numeric.Other.Separator.Decimals,
        Token.Literal.Numeric.Decimal("00"),
        Token.Literal.Numeric.Other.Suffix("m"),
        Token.Operator.Arithmetic.Addition,
        Token.Literal.Numeric.Decimal("2"),
        Token.Literal.Numeric.Other.Separator.Decimals,
        Token.Literal.Numeric.Decimal("00"),
        Token.Literal.Numeric.Other.Suffix("m"),
        Token.Punctuation.Comma,
        Token.Type("Bus"),
        Token.Identifier.LocalName("b"),
        Token.Operator.Arrow,
        Token.Literal.Numeric.Decimal("5"),
        Token.Literal.Numeric.Other.Separator.Decimals,
        Token.Literal.Numeric.Decimal("00"),
        Token.Literal.Numeric.Other.Suffix("m"),
        Token.Punctuation.Comma,
        Token.Punctuation.OpenBrace,
        Token.Punctuation.CloseBrace,
        Token.Operator.Arrow,
        Token.Keyword.Flow.Throw,
        Token.Operator.Expression.New,
        Token.Type("ArgumentException"),
        Token.Punctuation.OpenParen,
        Token.Identifier.ParameterName("message"),
        Token.Punctuation.Colon,
        Token.Punctuation.String.Begin,
        Token.Literal.String("Not a known vehicle type"),
        Token.Punctuation.String.End,
        Token.Punctuation.Comma,
        Token.Identifier.ParameterName("paramName"),
        Token.Punctuation.Colon,
        Token.Operator.Expression.NameOf,
        Token.Punctuation.OpenParen,
        Token.Variable.ReadWrite("vehicle"),
        Token.Punctuation.CloseParen,
        Token.Punctuation.CloseParen,
        Token.Punctuation.Comma,
        Token.Literal.Null,
        Token.Operator.Arrow,
        Token.Keyword.Flow.Throw,
        Token.Operator.Expression.New,
        Token.Type("ArgumentNullException"),
        Token.Punctuation.OpenParen,
        Token.Operator.Expression.NameOf,
        Token.Punctuation.OpenParen,
        Token.Variable.ReadWrite("vehicle"),
        Token.Punctuation.CloseParen,
        Token.Punctuation.CloseParen,
        Token.Punctuation.Comma,
        Token.Variable.Discard,
        Token.Operator.Arrow,
        Token.Literal.Numeric.Decimal("3"),
        Token.Literal.Numeric.Other.Separator.Decimals,
        Token.Literal.Numeric.Decimal("50"),
        Token.Literal.Numeric.Other.Suffix("m"),
        Token.Operator.Arithmetic.Subtraction,
        Token.Literal.Numeric.Decimal("1"),
        Token.Literal.Numeric.Other.Separator.Decimals,
        Token.Literal.Numeric.Decimal("00"),
        Token.Literal.Numeric.Other.Suffix("m"),
        Token.Punctuation.Comma,
        Token.Punctuation.CloseBrace,
        Token.Punctuation.Semicolon
      ]);
    });

    it("Type pattern", async () => {
      const input = Input.InClass(`
public static RGBColor FromRainbow(Rainbow colorBand) => colorBand switch
{
    Rainbow.Red => new RGBColor(0xFF, 0x00, 0x00),
    Rainbow.Orange => new RGBColor(0xFF, 0x7F, 0x00),
    Rainbow.Yellow => new RGBColor(0xFF, 0xFF, 0x00),
    Rainbow.Green => new RGBColor(0x00, 0xFF, 0x00),
    Rainbow.Blue => new RGBColor(0x00, 0x00, 0xFF),
    Rainbow.Indigo => new RGBColor(0x4B, 0x00, 0x82),
    Rainbow.Violet => new RGBColor(0x94, 0x00, 0xD3),
    _ => throw new ArgumentException(message: "invalid enum value", paramName: nameof(colorBand)),
};`);
      const tokens = await tokenize(input);
      tokens.should.deep.equal([
        Token.Keyword.Modifier.Public,
        Token.Keyword.Modifier.Static,
        Token.Type("RGBColor"),
        Token.Identifier.MethodName("FromRainbow"),
        Token.Punctuation.OpenParen,
        Token.Type("Rainbow"),
        Token.Identifier.ParameterName("colorBand"),
        Token.Punctuation.CloseParen,
        Token.Operator.Arrow,
        Token.Variable.ReadWrite("colorBand"),
        Token.Keyword.Conditional.Switch,
        Token.Punctuation.OpenBrace,
        Token.Type("Rainbow"),
        Token.Punctuation.Accessor,
        Token.Type("Red"),
        Token.Operator.Arrow,
        Token.Operator.Expression.New,
        Token.Type("RGBColor"),
        Token.Punctuation.OpenParen,
        Token.Literal.Numeric.Other.Prefix.Hexadecimal("0x"),
        Token.Literal.Numeric.Hexadecimal("FF"),
        Token.Punctuation.Comma,
        Token.Literal.Numeric.Other.Prefix.Hexadecimal("0x"),
        Token.Literal.Numeric.Hexadecimal("00"),
        Token.Punctuation.Comma,
        Token.Literal.Numeric.Other.Prefix.Hexadecimal("0x"),
        Token.Literal.Numeric.Hexadecimal("00"),
        Token.Punctuation.CloseParen,
        Token.Punctuation.Comma,
        Token.Type("Rainbow"),
        Token.Punctuation.Accessor,
        Token.Type("Orange"),
        Token.Operator.Arrow,
        Token.Operator.Expression.New,
        Token.Type("RGBColor"),
        Token.Punctuation.OpenParen,
        Token.Literal.Numeric.Other.Prefix.Hexadecimal("0x"),
        Token.Literal.Numeric.Hexadecimal("FF"),
        Token.Punctuation.Comma,
        Token.Literal.Numeric.Other.Prefix.Hexadecimal("0x"),
        Token.Literal.Numeric.Hexadecimal("7F"),
        Token.Punctuation.Comma,
        Token.Literal.Numeric.Other.Prefix.Hexadecimal("0x"),
        Token.Literal.Numeric.Hexadecimal("00"),
        Token.Punctuation.CloseParen,
        Token.Punctuation.Comma,
        Token.Type("Rainbow"),
        Token.Punctuation.Accessor,
        Token.Type("Yellow"),
        Token.Operator.Arrow,
        Token.Operator.Expression.New,
        Token.Type("RGBColor"),
        Token.Punctuation.OpenParen,
        Token.Literal.Numeric.Other.Prefix.Hexadecimal("0x"),
        Token.Literal.Numeric.Hexadecimal("FF"),
        Token.Punctuation.Comma,
        Token.Literal.Numeric.Other.Prefix.Hexadecimal("0x"),
        Token.Literal.Numeric.Hexadecimal("FF"),
        Token.Punctuation.Comma,
        Token.Literal.Numeric.Other.Prefix.Hexadecimal("0x"),
        Token.Literal.Numeric.Hexadecimal("00"),
        Token.Punctuation.CloseParen,
        Token.Punctuation.Comma,
        Token.Type("Rainbow"),
        Token.Punctuation.Accessor,
        Token.Type("Green"),
        Token.Operator.Arrow,
        Token.Operator.Expression.New,
        Token.Type("RGBColor"),
        Token.Punctuation.OpenParen,
        Token.Literal.Numeric.Other.Prefix.Hexadecimal("0x"),
        Token.Literal.Numeric.Hexadecimal("00"),
        Token.Punctuation.Comma,
        Token.Literal.Numeric.Other.Prefix.Hexadecimal("0x"),
        Token.Literal.Numeric.Hexadecimal("FF"),
        Token.Punctuation.Comma,
        Token.Literal.Numeric.Other.Prefix.Hexadecimal("0x"),
        Token.Literal.Numeric.Hexadecimal("00"),
        Token.Punctuation.CloseParen,
        Token.Punctuation.Comma,
        Token.Type("Rainbow"),
        Token.Punctuation.Accessor,
        Token.Type("Blue"),
        Token.Operator.Arrow,
        Token.Operator.Expression.New,
        Token.Type("RGBColor"),
        Token.Punctuation.OpenParen,
        Token.Literal.Numeric.Other.Prefix.Hexadecimal("0x"),
        Token.Literal.Numeric.Hexadecimal("00"),
        Token.Punctuation.Comma,
        Token.Literal.Numeric.Other.Prefix.Hexadecimal("0x"),
        Token.Literal.Numeric.Hexadecimal("00"),
        Token.Punctuation.Comma,
        Token.Literal.Numeric.Other.Prefix.Hexadecimal("0x"),
        Token.Literal.Numeric.Hexadecimal("FF"),
        Token.Punctuation.CloseParen,
        Token.Punctuation.Comma,
        Token.Type("Rainbow"),
        Token.Punctuation.Accessor,
        Token.Type("Indigo"),
        Token.Operator.Arrow,
        Token.Operator.Expression.New,
        Token.Type("RGBColor"),
        Token.Punctuation.OpenParen,
        Token.Literal.Numeric.Other.Prefix.Hexadecimal("0x"),
        Token.Literal.Numeric.Hexadecimal("4B"),
        Token.Punctuation.Comma,
        Token.Literal.Numeric.Other.Prefix.Hexadecimal("0x"),
        Token.Literal.Numeric.Hexadecimal("00"),
        Token.Punctuation.Comma,
        Token.Literal.Numeric.Other.Prefix.Hexadecimal("0x"),
        Token.Literal.Numeric.Hexadecimal("82"),
        Token.Punctuation.CloseParen,
        Token.Punctuation.Comma,
        Token.Type("Rainbow"),
        Token.Punctuation.Accessor,
        Token.Type("Violet"),
        Token.Operator.Arrow,
        Token.Operator.Expression.New,
        Token.Type("RGBColor"),
        Token.Punctuation.OpenParen,
        Token.Literal.Numeric.Other.Prefix.Hexadecimal("0x"),
        Token.Literal.Numeric.Hexadecimal("94"),
        Token.Punctuation.Comma,
        Token.Literal.Numeric.Other.Prefix.Hexadecimal("0x"),
        Token.Literal.Numeric.Hexadecimal("00"),
        Token.Punctuation.Comma,
        Token.Literal.Numeric.Other.Prefix.Hexadecimal("0x"),
        Token.Literal.Numeric.Hexadecimal("D3"),
        Token.Punctuation.CloseParen,
        Token.Punctuation.Comma,
        Token.Variable.Discard,
        Token.Operator.Arrow,
        Token.Keyword.Flow.Throw,
        Token.Operator.Expression.New,
        Token.Type("ArgumentException"),
        Token.Punctuation.OpenParen,
        Token.Identifier.ParameterName("message"),
        Token.Punctuation.Colon,
        Token.Punctuation.String.Begin,
        Token.Literal.String("invalid enum value"),
        Token.Punctuation.String.End,
        Token.Punctuation.Comma,
        Token.Identifier.ParameterName("paramName"),
        Token.Punctuation.Colon,
        Token.Operator.Expression.NameOf,
        Token.Punctuation.OpenParen,
        Token.Variable.ReadWrite("colorBand"),
        Token.Punctuation.CloseParen,
        Token.Punctuation.CloseParen,
        Token.Punctuation.Comma,
        Token.Punctuation.CloseBrace,
        Token.Punctuation.Semicolon
      ]);
    });

    it("Property pattern", async () => {
      const input = Input.InClass(`
public static decimal ComputeSalesTax(Address location, decimal salePrice) =>
  location switch
  {
      { State: "WA" } => salePrice * 0.06M,
      { State: "MN" } => salePrice * 0.75M,
      { State: "MI" } => salePrice * 0.05M,
      // other cases removed for brevity...
      _ => 0M
  };`);
      const tokens = await tokenize(input);
      tokens.should.deep.equal([
        Token.Keyword.Modifier.Public,
        Token.Keyword.Modifier.Static,
        Token.PrimitiveType.Decimal,
        Token.Identifier.MethodName("ComputeSalesTax"),
        Token.Punctuation.OpenParen,
        Token.Type("Address"),
        Token.Identifier.ParameterName("location"),
        Token.Punctuation.Comma,
        Token.PrimitiveType.Decimal,
        Token.Identifier.ParameterName("salePrice"),
        Token.Punctuation.CloseParen,
        Token.Operator.Arrow,
        Token.Variable.ReadWrite("location"),
        Token.Keyword.Conditional.Switch,
        Token.Punctuation.OpenBrace,
        Token.Punctuation.OpenBrace,
        Token.Variable.Property("State"),
        Token.Punctuation.Colon,
        Token.Punctuation.String.Begin,
        Token.Literal.String("WA"),
        Token.Punctuation.String.End,
        Token.Punctuation.CloseBrace,
        Token.Operator.Arrow,
        Token.Variable.ReadWrite("salePrice"),
        Token.Operator.Arithmetic.Multiplication,
        Token.Literal.Numeric.Decimal("0"),
        Token.Literal.Numeric.Other.Separator.Decimals,
        Token.Literal.Numeric.Decimal("06"),
        Token.Literal.Numeric.Other.Suffix("M"),
        Token.Punctuation.Comma,
        Token.Punctuation.OpenBrace,
        Token.Variable.Property("State"),
        Token.Punctuation.Colon,
        Token.Punctuation.String.Begin,
        Token.Literal.String("MN"),
        Token.Punctuation.String.End,
        Token.Punctuation.CloseBrace,
        Token.Operator.Arrow,
        Token.Variable.ReadWrite("salePrice"),
        Token.Operator.Arithmetic.Multiplication,
        Token.Literal.Numeric.Decimal("0"),
        Token.Literal.Numeric.Other.Separator.Decimals,
        Token.Literal.Numeric.Decimal("75"),
        Token.Literal.Numeric.Other.Suffix("M"),
        Token.Punctuation.Comma,
        Token.Punctuation.OpenBrace,
        Token.Variable.Property("State"),
        Token.Punctuation.Colon,
        Token.Punctuation.String.Begin,
        Token.Literal.String("MI"),
        Token.Punctuation.String.End,
        Token.Punctuation.CloseBrace,
        Token.Operator.Arrow,
        Token.Variable.ReadWrite("salePrice"),
        Token.Operator.Arithmetic.Multiplication,
        Token.Literal.Numeric.Decimal("0"),
        Token.Literal.Numeric.Other.Separator.Decimals,
        Token.Literal.Numeric.Decimal("05"),
        Token.Literal.Numeric.Other.Suffix("M"),
        Token.Punctuation.Comma,
        Token.Comment.LeadingWhitespace("      "),
        Token.Comment.SingleLine.Start,
        Token.Comment.SingleLine.Text(" other cases removed for brevity..."),
        Token.Variable.Discard,
        Token.Operator.Arrow,
        Token.Literal.Numeric.Decimal("0"),
        Token.Literal.Numeric.Other.Suffix("M"),
        Token.Punctuation.CloseBrace,
        Token.Punctuation.Semicolon
      ]);
    });

    it("Positional pattern", async () => {
      const input = Input.InClass(`
public static string RockPaperScissors(string first, string second)
  => (first, second) switch
  {
      ("rock", "paper") => "rock is covered by paper. Paper wins.",
      ("rock", "scissors") => "rock breaks scissors. Rock wins.",
      ("paper", "rock") => "paper covers rock. Paper wins.",
      ("paper", "scissors") => "paper is cut by scissors. Scissors wins.",
      ("scissors", "rock") => "scissors is broken by rock. Rock wins.",
      ("scissors", "paper") => "scissors cuts paper. Scissors wins.",
      (_, _) => "tie"
  };`);
      const tokens = await tokenize(input);
      tokens.should.deep.equal([
        Token.Keyword.Modifier.Public,
        Token.Keyword.Modifier.Static,
        Token.PrimitiveType.String,
        Token.Identifier.MethodName("RockPaperScissors"),
        Token.Punctuation.OpenParen,
        Token.PrimitiveType.String,
        Token.Identifier.ParameterName("first"),
        Token.Punctuation.Comma,
        Token.PrimitiveType.String,
        Token.Identifier.ParameterName("second"),
        Token.Punctuation.CloseParen,
        Token.Operator.Arrow,
        Token.Punctuation.OpenParen,
        Token.Variable.ReadWrite("first"),
        Token.Punctuation.Comma,
        Token.Variable.ReadWrite("second"),
        Token.Punctuation.CloseParen,
        Token.Keyword.Conditional.Switch,
        Token.Punctuation.OpenBrace,
        Token.Punctuation.OpenParen,
        Token.Punctuation.String.Begin,
        Token.Literal.String("rock"),
        Token.Punctuation.String.End,
        Token.Punctuation.Comma,
        Token.Punctuation.String.Begin,
        Token.Literal.String("paper"),
        Token.Punctuation.String.End,
        Token.Punctuation.CloseParen,
        Token.Operator.Arrow,
        Token.Punctuation.String.Begin,
        Token.Literal.String("rock is covered by paper. Paper wins."),
        Token.Punctuation.String.End,
        Token.Punctuation.Comma,
        Token.Punctuation.OpenParen,
        Token.Punctuation.String.Begin,
        Token.Literal.String("rock"),
        Token.Punctuation.String.End,
        Token.Punctuation.Comma,
        Token.Punctuation.String.Begin,
        Token.Literal.String("scissors"),
        Token.Punctuation.String.End,
        Token.Punctuation.CloseParen,
        Token.Operator.Arrow,
        Token.Punctuation.String.Begin,
        Token.Literal.String("rock breaks scissors. Rock wins."),
        Token.Punctuation.String.End,
        Token.Punctuation.Comma,
        Token.Punctuation.OpenParen,
        Token.Punctuation.String.Begin,
        Token.Literal.String("paper"),
        Token.Punctuation.String.End,
        Token.Punctuation.Comma,
        Token.Punctuation.String.Begin,
        Token.Literal.String("rock"),
        Token.Punctuation.String.End,
        Token.Punctuation.CloseParen,
        Token.Operator.Arrow,
        Token.Punctuation.String.Begin,
        Token.Literal.String("paper covers rock. Paper wins."),
        Token.Punctuation.String.End,
        Token.Punctuation.Comma,
        Token.Punctuation.OpenParen,
        Token.Punctuation.String.Begin,
        Token.Literal.String("paper"),
        Token.Punctuation.String.End,
        Token.Punctuation.Comma,
        Token.Punctuation.String.Begin,
        Token.Literal.String("scissors"),
        Token.Punctuation.String.End,
        Token.Punctuation.CloseParen,
        Token.Operator.Arrow,
        Token.Punctuation.String.Begin,
        Token.Literal.String("paper is cut by scissors. Scissors wins."),
        Token.Punctuation.String.End,
        Token.Punctuation.Comma,
        Token.Punctuation.OpenParen,
        Token.Punctuation.String.Begin,
        Token.Literal.String("scissors"),
        Token.Punctuation.String.End,
        Token.Punctuation.Comma,
        Token.Punctuation.String.Begin,
        Token.Literal.String("rock"),
        Token.Punctuation.String.End,
        Token.Punctuation.CloseParen,
        Token.Operator.Arrow,
        Token.Punctuation.String.Begin,
        Token.Literal.String("scissors is broken by rock. Rock wins."),
        Token.Punctuation.String.End,
        Token.Punctuation.Comma,
        Token.Punctuation.OpenParen,
        Token.Punctuation.String.Begin,
        Token.Literal.String("scissors"),
        Token.Punctuation.String.End,
        Token.Punctuation.Comma,
        Token.Punctuation.String.Begin,
        Token.Literal.String("paper"),
        Token.Punctuation.String.End,
        Token.Punctuation.CloseParen,
        Token.Operator.Arrow,
        Token.Punctuation.String.Begin,
        Token.Literal.String("scissors cuts paper. Scissors wins."),
        Token.Punctuation.String.End,
        Token.Punctuation.Comma,
        Token.Punctuation.OpenParen,
        Token.Variable.Discard,
        Token.Punctuation.Comma,
        Token.Variable.Discard,
        Token.Punctuation.CloseParen,
        Token.Operator.Arrow,
        Token.Punctuation.String.Begin,
        Token.Literal.String("tie"),
        Token.Punctuation.String.End,
        Token.Punctuation.CloseBrace,
        Token.Punctuation.Semicolon
      ]);
    });

    it("var pattern", async () => {
      const input = Input.InClass(`
public static Quadrant GetQuadrant(Point point) => point switch
  {
      (0, 0) => Quadrant.Origin,
      var (x, y) when x > 0 && y > 0 => Quadrant.One,
      var (x, y) when x < 0 && y > 0 => Quadrant.Two,
      var (x, y) when x < 0 && y < 0 => Quadrant.Three,
      var (x, y) when x > 0 && y < 0 => Quadrant.Four,
      var (_, _) => Quadrant.OnBorder,
      _ => Quadrant.Unknown
  };`);
      const tokens = await tokenize(input);
      tokens.should.deep.equal([
        Token.Keyword.Modifier.Public,
        Token.Keyword.Modifier.Static,
        Token.Type("Quadrant"),
        Token.Identifier.MethodName("GetQuadrant"),
        Token.Punctuation.OpenParen,
        Token.Type("Point"),
        Token.Identifier.ParameterName("point"),
        Token.Punctuation.CloseParen,
        Token.Operator.Arrow,
        Token.Variable.ReadWrite("point"),
        Token.Keyword.Conditional.Switch,
        Token.Punctuation.OpenBrace,
        Token.Punctuation.OpenParen,
        Token.Literal.Numeric.Decimal("0"),
        Token.Punctuation.Comma,
        Token.Literal.Numeric.Decimal("0"),
        Token.Punctuation.CloseParen,
        Token.Operator.Arrow,
        Token.Variable.Object("Quadrant"),
        Token.Punctuation.Accessor,
        Token.Variable.Property("Origin"),
        Token.Punctuation.Comma,
        Token.Keyword.Definition.Var,
        Token.Punctuation.OpenParen,
        Token.Identifier.LocalName("x"),
        Token.Punctuation.Comma,
        Token.Identifier.LocalName("y"),
        Token.Punctuation.CloseParen,
        Token.Keyword.Conditional.When,
        Token.Variable.ReadWrite("x"),
        Token.Operator.Relational.GreaterThan,
        Token.Literal.Numeric.Decimal("0"),
        Token.Operator.Logical.And,
        Token.Variable.ReadWrite("y"),
        Token.Operator.Relational.GreaterThan,
        Token.Literal.Numeric.Decimal("0"),
        Token.Operator.Arrow,
        Token.Variable.Object("Quadrant"),
        Token.Punctuation.Accessor,
        Token.Variable.Property("One"),
        Token.Punctuation.Comma,
        Token.Keyword.Definition.Var,
        Token.Punctuation.OpenParen,
        Token.Identifier.LocalName("x"),
        Token.Punctuation.Comma,
        Token.Identifier.LocalName("y"),
        Token.Punctuation.CloseParen,
        Token.Keyword.Conditional.When,
        Token.Variable.ReadWrite("x"),
        Token.Operator.Relational.LessThan,
        Token.Literal.Numeric.Decimal("0"),
        Token.Operator.Logical.And,
        Token.Variable.ReadWrite("y"),
        Token.Operator.Relational.GreaterThan,
        Token.Literal.Numeric.Decimal("0"),
        Token.Operator.Arrow,
        Token.Variable.Object("Quadrant"),
        Token.Punctuation.Accessor,
        Token.Variable.Property("Two"),
        Token.Punctuation.Comma,
        Token.Keyword.Definition.Var,
        Token.Punctuation.OpenParen,
        Token.Identifier.LocalName("x"),
        Token.Punctuation.Comma,
        Token.Identifier.LocalName("y"),
        Token.Punctuation.CloseParen,
        Token.Keyword.Conditional.When,
        Token.Variable.ReadWrite("x"),
        Token.Operator.Relational.LessThan,
        Token.Literal.Numeric.Decimal("0"),
        Token.Operator.Logical.And,
        Token.Variable.ReadWrite("y"),
        Token.Operator.Relational.LessThan,
        Token.Literal.Numeric.Decimal("0"),
        Token.Operator.Arrow,
        Token.Variable.Object("Quadrant"),
        Token.Punctuation.Accessor,
        Token.Variable.Property("Three"),
        Token.Punctuation.Comma,
        Token.Keyword.Definition.Var,
        Token.Punctuation.OpenParen,
        Token.Identifier.LocalName("x"),
        Token.Punctuation.Comma,
        Token.Identifier.LocalName("y"),
        Token.Punctuation.CloseParen,
        Token.Keyword.Conditional.When,
        Token.Variable.ReadWrite("x"),
        Token.Operator.Relational.GreaterThan,
        Token.Literal.Numeric.Decimal("0"),
        Token.Operator.Logical.And,
        Token.Variable.ReadWrite("y"),
        Token.Operator.Relational.LessThan,
        Token.Literal.Numeric.Decimal("0"),
        Token.Operator.Arrow,
        Token.Variable.Object("Quadrant"),
        Token.Punctuation.Accessor,
        Token.Variable.Property("Four"),
        Token.Punctuation.Comma,
        Token.Keyword.Definition.Var,
        Token.Punctuation.OpenParen,
        Token.Variable.Discard,
        Token.Punctuation.Comma,
        Token.Variable.Discard,
        Token.Punctuation.CloseParen,
        Token.Operator.Arrow,
        Token.Variable.Object("Quadrant"),
        Token.Punctuation.Accessor,
        Token.Variable.Property("OnBorder"),
        Token.Punctuation.Comma,
        Token.Variable.Discard,
        Token.Operator.Arrow,
        Token.Variable.Object("Quadrant"),
        Token.Punctuation.Accessor,
        Token.Variable.Property("Unknown"),
        Token.Punctuation.CloseBrace,
        Token.Punctuation.Semicolon
      ]);
    });

    it("when clause", async () => {
      const input = Input.InClass(`
public decimal CalculateToll(object vehicle) =>
  vehicle switch
  {
      Car c => c.Passengers switch
      {
          0 => 2.00m + 0.50m,
          1 => 2.0m,
          2 => 2.0m - 0.50m,
          _ => 2.00m - 1.0m,
      },

      Taxi { Fares: 0 } => 3.50m + 1.00m,
      Taxi { Fares: 1 } => 3.50m,
      Taxi { Fares: 2 } => 3.50m - 0.50m,
      Taxi t => 3.50m - 1.00m,

      Bus b when (double)b.Riders / (double)b.Capacity < 0.50 => 5.00m + 2.00m,
      Bus b when ((double)b.Riders / (double)b.Capacity) > 0.90 => 5.00m - 1.00m,
      Bus b => 5.00m,

      DeliveryTruck t when (t.GrossWeightClass > 5000) => 10.00m + 5.00m,
      DeliveryTruck t when (t.GrossWeightClass < 3000) => 10.00m - 2.00m,
      DeliveryTruck t => 10.00m,
      null => throw new ArgumentNullException(nameof(vehicle)),
      { } => throw new ArgumentException(message: "Not a known vehicle type", paramName: nameof(vehicle)),
  };`);
      const tokens = await tokenize(input);
      tokens.should.deep.equal([
        Token.Keyword.Modifier.Public,
        Token.PrimitiveType.Decimal,
        Token.Identifier.MethodName("CalculateToll"),
        Token.Punctuation.OpenParen,
        Token.PrimitiveType.Object,
        Token.Identifier.ParameterName("vehicle"),
        Token.Punctuation.CloseParen,
        Token.Operator.Arrow,
        Token.Variable.ReadWrite("vehicle"),
        Token.Keyword.Conditional.Switch,
        Token.Punctuation.OpenBrace,
        Token.Type("Car"),
        Token.Identifier.LocalName("c"),
        Token.Operator.Arrow,
        Token.Variable.Object("c"),
        Token.Punctuation.Accessor,
        Token.Variable.Property("Passengers"),
        Token.Keyword.Conditional.Switch,
        Token.Punctuation.OpenBrace,
        Token.Literal.Numeric.Decimal("0"),
        Token.Operator.Arrow,
        Token.Literal.Numeric.Decimal("2"),
        Token.Literal.Numeric.Other.Separator.Decimals,
        Token.Literal.Numeric.Decimal("00"),
        Token.Literal.Numeric.Other.Suffix("m"),
        Token.Operator.Arithmetic.Addition,
        Token.Literal.Numeric.Decimal("0"),
        Token.Literal.Numeric.Other.Separator.Decimals,
        Token.Literal.Numeric.Decimal("50"),
        Token.Literal.Numeric.Other.Suffix("m"),
        Token.Punctuation.Comma,
        Token.Literal.Numeric.Decimal("1"),
        Token.Operator.Arrow,
        Token.Literal.Numeric.Decimal("2"),
        Token.Literal.Numeric.Other.Separator.Decimals,
        Token.Literal.Numeric.Decimal("0"),
        Token.Literal.Numeric.Other.Suffix("m"),
        Token.Punctuation.Comma,
        Token.Literal.Numeric.Decimal("2"),
        Token.Operator.Arrow,
        Token.Literal.Numeric.Decimal("2"),
        Token.Literal.Numeric.Other.Separator.Decimals,
        Token.Literal.Numeric.Decimal("0"),
        Token.Literal.Numeric.Other.Suffix("m"),
        Token.Operator.Arithmetic.Subtraction,
        Token.Literal.Numeric.Decimal("0"),
        Token.Literal.Numeric.Other.Separator.Decimals,
        Token.Literal.Numeric.Decimal("50"),
        Token.Literal.Numeric.Other.Suffix("m"),
        Token.Punctuation.Comma,
        Token.Variable.Discard,
        Token.Operator.Arrow,
        Token.Literal.Numeric.Decimal("2"),
        Token.Literal.Numeric.Other.Separator.Decimals,
        Token.Literal.Numeric.Decimal("00"),
        Token.Literal.Numeric.Other.Suffix("m"),
        Token.Operator.Arithmetic.Subtraction,
        Token.Literal.Numeric.Decimal("1"),
        Token.Literal.Numeric.Other.Separator.Decimals,
        Token.Literal.Numeric.Decimal("0"),
        Token.Literal.Numeric.Other.Suffix("m"),
        Token.Punctuation.Comma,
        Token.Punctuation.CloseBrace,
        Token.Punctuation.Comma,
        Token.Type("Taxi"),
        Token.Punctuation.OpenBrace,
        Token.Variable.Property("Fares"),
        Token.Punctuation.Colon,
        Token.Literal.Numeric.Decimal("0"),
        Token.Punctuation.CloseBrace,
        Token.Operator.Arrow,
        Token.Literal.Numeric.Decimal("3"),
        Token.Literal.Numeric.Other.Separator.Decimals,
        Token.Literal.Numeric.Decimal("50"),
        Token.Literal.Numeric.Other.Suffix("m"),
        Token.Operator.Arithmetic.Addition,
        Token.Literal.Numeric.Decimal("1"),
        Token.Literal.Numeric.Other.Separator.Decimals,
        Token.Literal.Numeric.Decimal("00"),
        Token.Literal.Numeric.Other.Suffix("m"),
        Token.Punctuation.Comma,
        Token.Type("Taxi"),
        Token.Punctuation.OpenBrace,
        Token.Variable.Property("Fares"),
        Token.Punctuation.Colon,
        Token.Literal.Numeric.Decimal("1"),
        Token.Punctuation.CloseBrace,
        Token.Operator.Arrow,
        Token.Literal.Numeric.Decimal("3"),
        Token.Literal.Numeric.Other.Separator.Decimals,
        Token.Literal.Numeric.Decimal("50"),
        Token.Literal.Numeric.Other.Suffix("m"),
        Token.Punctuation.Comma,
        Token.Type("Taxi"),
        Token.Punctuation.OpenBrace,
        Token.Variable.Property("Fares"),
        Token.Punctuation.Colon,
        Token.Literal.Numeric.Decimal("2"),
        Token.Punctuation.CloseBrace,
        Token.Operator.Arrow,
        Token.Literal.Numeric.Decimal("3"),
        Token.Literal.Numeric.Other.Separator.Decimals,
        Token.Literal.Numeric.Decimal("50"),
        Token.Literal.Numeric.Other.Suffix("m"),
        Token.Operator.Arithmetic.Subtraction,
        Token.Literal.Numeric.Decimal("0"),
        Token.Literal.Numeric.Other.Separator.Decimals,
        Token.Literal.Numeric.Decimal("50"),
        Token.Literal.Numeric.Other.Suffix("m"),
        Token.Punctuation.Comma,
        Token.Type("Taxi"),
        Token.Identifier.LocalName("t"),
        Token.Operator.Arrow,
        Token.Literal.Numeric.Decimal("3"),
        Token.Literal.Numeric.Other.Separator.Decimals,
        Token.Literal.Numeric.Decimal("50"),
        Token.Literal.Numeric.Other.Suffix("m"),
        Token.Operator.Arithmetic.Subtraction,
        Token.Literal.Numeric.Decimal("1"),
        Token.Literal.Numeric.Other.Separator.Decimals,
        Token.Literal.Numeric.Decimal("00"),
        Token.Literal.Numeric.Other.Suffix("m"),
        Token.Punctuation.Comma,
        Token.Type("Bus"),
        Token.Identifier.LocalName("b"),
        Token.Keyword.Conditional.When,
        Token.Punctuation.OpenParen,
        Token.PrimitiveType.Double,
        Token.Punctuation.CloseParen,
        Token.Variable.Object("b"),
        Token.Punctuation.Accessor,
        Token.Variable.Property("Riders"),
        Token.Operator.Arithmetic.Division,
        Token.Punctuation.OpenParen,
        Token.PrimitiveType.Double,
        Token.Punctuation.CloseParen,
        Token.Variable.Object("b"),
        Token.Punctuation.Accessor,
        Token.Variable.Property("Capacity"),
        Token.Operator.Relational.LessThan,
        Token.Literal.Numeric.Decimal("0"),
        Token.Literal.Numeric.Other.Separator.Decimals,
        Token.Literal.Numeric.Decimal("50"),
        Token.Operator.Arrow,
        Token.Literal.Numeric.Decimal("5"),
        Token.Literal.Numeric.Other.Separator.Decimals,
        Token.Literal.Numeric.Decimal("00"),
        Token.Literal.Numeric.Other.Suffix("m"),
        Token.Operator.Arithmetic.Addition,
        Token.Literal.Numeric.Decimal("2"),
        Token.Literal.Numeric.Other.Separator.Decimals,
        Token.Literal.Numeric.Decimal("00"),
        Token.Literal.Numeric.Other.Suffix("m"),
        Token.Punctuation.Comma,
        Token.Type("Bus"),
        Token.Identifier.LocalName("b"),
        Token.Keyword.Conditional.When,
        Token.Punctuation.OpenParen,
        Token.Punctuation.OpenParen,
        Token.PrimitiveType.Double,
        Token.Punctuation.CloseParen,
        Token.Variable.Object("b"),
        Token.Punctuation.Accessor,
        Token.Variable.Property("Riders"),
        Token.Operator.Arithmetic.Division,
        Token.Punctuation.OpenParen,
        Token.PrimitiveType.Double,
        Token.Punctuation.CloseParen,
        Token.Variable.Object("b"),
        Token.Punctuation.Accessor,
        Token.Variable.Property("Capacity"),
        Token.Punctuation.CloseParen,
        Token.Operator.Relational.GreaterThan,
        Token.Literal.Numeric.Decimal("0"),
        Token.Literal.Numeric.Other.Separator.Decimals,
        Token.Literal.Numeric.Decimal("90"),
        Token.Operator.Arrow,
        Token.Literal.Numeric.Decimal("5"),
        Token.Literal.Numeric.Other.Separator.Decimals,
        Token.Literal.Numeric.Decimal("00"),
        Token.Literal.Numeric.Other.Suffix("m"),
        Token.Operator.Arithmetic.Subtraction,
        Token.Literal.Numeric.Decimal("1"),
        Token.Literal.Numeric.Other.Separator.Decimals,
        Token.Literal.Numeric.Decimal("00"),
        Token.Literal.Numeric.Other.Suffix("m"),
        Token.Punctuation.Comma,
        Token.Type("Bus"),
        Token.Identifier.LocalName("b"),
        Token.Operator.Arrow,
        Token.Literal.Numeric.Decimal("5"),
        Token.Literal.Numeric.Other.Separator.Decimals,
        Token.Literal.Numeric.Decimal("00"),
        Token.Literal.Numeric.Other.Suffix("m"),
        Token.Punctuation.Comma,
        Token.Type("DeliveryTruck"),
        Token.Identifier.LocalName("t"),
        Token.Keyword.Conditional.When,
        Token.Punctuation.OpenParen,
        Token.Variable.Object("t"),
        Token.Punctuation.Accessor,
        Token.Variable.Property("GrossWeightClass"),
        Token.Operator.Relational.GreaterThan,
        Token.Literal.Numeric.Decimal("5000"),
        Token.Punctuation.CloseParen,
        Token.Operator.Arrow,
        Token.Literal.Numeric.Decimal("10"),
        Token.Literal.Numeric.Other.Separator.Decimals,
        Token.Literal.Numeric.Decimal("00"),
        Token.Literal.Numeric.Other.Suffix("m"),
        Token.Operator.Arithmetic.Addition,
        Token.Literal.Numeric.Decimal("5"),
        Token.Literal.Numeric.Other.Separator.Decimals,
        Token.Literal.Numeric.Decimal("00"),
        Token.Literal.Numeric.Other.Suffix("m"),
        Token.Punctuation.Comma,
        Token.Type("DeliveryTruck"),
        Token.Identifier.LocalName("t"),
        Token.Keyword.Conditional.When,
        Token.Punctuation.OpenParen,
        Token.Variable.Object("t"),
        Token.Punctuation.Accessor,
        Token.Variable.Property("GrossWeightClass"),
        Token.Operator.Relational.LessThan,
        Token.Literal.Numeric.Decimal("3000"),
        Token.Punctuation.CloseParen,
        Token.Operator.Arrow,
        Token.Literal.Numeric.Decimal("10"),
        Token.Literal.Numeric.Other.Separator.Decimals,
        Token.Literal.Numeric.Decimal("00"),
        Token.Literal.Numeric.Other.Suffix("m"),
        Token.Operator.Arithmetic.Subtraction,
        Token.Literal.Numeric.Decimal("2"),
        Token.Literal.Numeric.Other.Separator.Decimals,
        Token.Literal.Numeric.Decimal("00"),
        Token.Literal.Numeric.Other.Suffix("m"),
        Token.Punctuation.Comma,
        Token.Type("DeliveryTruck"),
        Token.Identifier.LocalName("t"),
        Token.Operator.Arrow,
        Token.Literal.Numeric.Decimal("10"),
        Token.Literal.Numeric.Other.Separator.Decimals,
        Token.Literal.Numeric.Decimal("00"),
        Token.Literal.Numeric.Other.Suffix("m"),
        Token.Punctuation.Comma,
        Token.Literal.Null,
        Token.Operator.Arrow,
        Token.Keyword.Flow.Throw,
        Token.Operator.Expression.New,
        Token.Type("ArgumentNullException"),
        Token.Punctuation.OpenParen,
        Token.Operator.Expression.NameOf,
        Token.Punctuation.OpenParen,
        Token.Variable.ReadWrite("vehicle"),
        Token.Punctuation.CloseParen,
        Token.Punctuation.CloseParen,
        Token.Punctuation.Comma,
        Token.Punctuation.OpenBrace,
        Token.Punctuation.CloseBrace,
        Token.Operator.Arrow,
        Token.Keyword.Flow.Throw,
        Token.Operator.Expression.New,
        Token.Type("ArgumentException"),
        Token.Punctuation.OpenParen,
        Token.Identifier.ParameterName("message"),
        Token.Punctuation.Colon,
        Token.Punctuation.String.Begin,
        Token.Literal.String("Not a known vehicle type"),
        Token.Punctuation.String.End,
        Token.Punctuation.Comma,
        Token.Identifier.ParameterName("paramName"),
        Token.Punctuation.Colon,
        Token.Operator.Expression.NameOf,
        Token.Punctuation.OpenParen,
        Token.Variable.ReadWrite("vehicle"),
        Token.Punctuation.CloseParen,
        Token.Punctuation.CloseParen,
        Token.Punctuation.Comma,
        Token.Punctuation.CloseBrace,
        Token.Punctuation.Semicolon
      ]);
    });

    it("does not highlight variable names starting with 'switch' (issue #208)", async () => {
      const input = Input.InClass(`
private bool switchedOn = false;

private bool DecodeSwitchString(string switchString) {
    var switchOn = false;
    if (!this.switchedOn)
    {
        switchOn = switchString.ToUpper() == "ON";
    }
    return switchOn;
}`);
      const tokens = await tokenize(input);
      tokens.should.deep.equal([
        Token.Keyword.Modifier.Private,
        Token.PrimitiveType.Bool,
        Token.Identifier.FieldName("switchedOn"),
        Token.Operator.Assignment,
        Token.Literal.Boolean.False,
        Token.Punctuation.Semicolon,
        Token.Keyword.Modifier.Private,
        Token.PrimitiveType.Bool,
        Token.Identifier.MethodName("DecodeSwitchString"),
        Token.Punctuation.OpenParen,
        Token.PrimitiveType.String,
        Token.Identifier.ParameterName("switchString"),
        Token.Punctuation.CloseParen,
        Token.Punctuation.OpenBrace,
        Token.Keyword.Definition.Var,
        Token.Identifier.LocalName("switchOn"),
        Token.Operator.Assignment,
        Token.Literal.Boolean.False,
        Token.Punctuation.Semicolon,
        Token.Keyword.Conditional.If,
        Token.Punctuation.OpenParen,
        Token.Operator.Logical.Not,
        Token.Variable.This,
        Token.Punctuation.Accessor,
        Token.Variable.Property("switchedOn"),
        Token.Punctuation.CloseParen,
        Token.Punctuation.OpenBrace,
        Token.Variable.ReadWrite("switchOn"),
        Token.Operator.Assignment,
        Token.Variable.Object("switchString"),
        Token.Punctuation.Accessor,
        Token.Identifier.MethodName("ToUpper"),
        Token.Punctuation.OpenParen,
        Token.Punctuation.CloseParen,
        Token.Operator.Relational.Equals,
        Token.Punctuation.String.Begin,
        Token.Literal.String("ON"),
        Token.Punctuation.String.End,
        Token.Punctuation.Semicolon,
        Token.Punctuation.CloseBrace,
        Token.Keyword.Flow.Return,
        Token.Variable.ReadWrite("switchOn"),
        Token.Punctuation.Semicolon,
        Token.Punctuation.CloseBrace
      ]);
    });
  });
});

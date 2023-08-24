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
        Token.Keywords.Control.If,
        Token.Punctuation.OpenParen,
        Token.Variables.ReadWrite("var"),
        Token.Operators.Pattern.Is,
        Token.Variables.Discard,
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
        Token.Keywords.Control.If,
        Token.Punctuation.OpenParen,
        Token.Variables.ReadWrite("var"),
        Token.Operators.Pattern.Is,
        Token.Literals.Numeric.Decimal("0"),
        Token.Punctuation.CloseParen,
        Token.Punctuation.OpenBrace,
        Token.Punctuation.CloseBrace,

        Token.Keywords.Control.If,
        Token.Punctuation.OpenParen,
        Token.Variables.ReadWrite("var"),
        Token.Operators.Pattern.Is,
        Token.Literals.Null,
        Token.Punctuation.CloseParen,
        Token.Punctuation.OpenBrace,
        Token.Punctuation.CloseBrace,

        Token.Keywords.Control.If,
        Token.Punctuation.OpenParen,
        Token.Variables.ReadWrite("var"),
        Token.Operators.Pattern.Is,
        Token.Punctuation.String.Begin,
        Token.Punctuation.String.End,
        Token.Punctuation.CloseParen,
        Token.Punctuation.OpenBrace,
        Token.Punctuation.CloseBrace,

        Token.Keywords.Control.If,
        Token.Punctuation.OpenParen,
        Token.Variables.ReadWrite("var"),
        Token.Operators.Pattern.Is,
        Token.Literals.Boolean.True,
        Token.Punctuation.CloseParen,
        Token.Punctuation.OpenBrace,
        Token.Punctuation.CloseBrace,

        Token.Keywords.Control.If,
        Token.Punctuation.OpenParen,
        Token.Variables.ReadWrite("var"),
        Token.Operators.Pattern.Is,
        Token.Keywords.NameOf,
        Token.Punctuation.OpenParen,
        Token.Variables.ReadWrite("Foo"),
        Token.Punctuation.CloseParen,
        Token.Punctuation.CloseParen,
        Token.Punctuation.OpenBrace,
        Token.Punctuation.CloseBrace,

        Token.Keywords.Control.If,
        Token.Punctuation.OpenParen,
        Token.Variables.ReadWrite("var"),
        Token.Operators.Pattern.Is,
        Token.Keywords.Default,
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
        Token.Keywords.Control.If,
        Token.Punctuation.OpenParen,
        Token.Variables.ReadWrite("var"),
        Token.Operators.Pattern.Is,
        Token.Operators.Relational.GreaterThan,
        Token.Literals.Numeric.Decimal("0"),
        Token.Punctuation.CloseParen,
        Token.Punctuation.OpenBrace,
        Token.Punctuation.CloseBrace,

        Token.Keywords.Control.If,
        Token.Punctuation.OpenParen,
        Token.Variables.ReadWrite("var"),
        Token.Operators.Pattern.Is,
        Token.Operators.Relational.LessThan,
        Token.Literals.Numeric.Decimal("0"),
        Token.Punctuation.CloseParen,
        Token.Punctuation.OpenBrace,
        Token.Punctuation.CloseBrace,

        Token.Keywords.Control.If,
        Token.Punctuation.OpenParen,
        Token.Variables.ReadWrite("var"),
        Token.Operators.Pattern.Is,
        Token.Operators.Relational.GreaterThanOrEqual,
        Token.Literals.Numeric.Decimal("0"),
        Token.Punctuation.CloseParen,
        Token.Punctuation.OpenBrace,
        Token.Punctuation.CloseBrace,

        Token.Keywords.Control.If,
        Token.Punctuation.OpenParen,
        Token.Variables.ReadWrite("var"),
        Token.Operators.Pattern.Is,
        Token.Operators.Relational.LessThanOrEqual,
        Token.Literals.Numeric.Decimal("0"),
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
        Token.Keywords.Control.If,
        Token.Punctuation.OpenParen,
        Token.Variables.ReadWrite("var"),
        Token.Operators.Pattern.Is,
        Token.PrimitiveType.String,
        Token.Identifiers.LocalName("str"),
        Token.Punctuation.CloseParen,
        Token.Punctuation.OpenBrace,
        Token.Punctuation.CloseBrace,

        Token.Keywords.Control.If,
        Token.Punctuation.OpenParen,
        Token.Variables.ReadWrite("var"),
        Token.Operators.Pattern.Is,
        Token.Type("List"),
        Token.Punctuation.TypeParameters.Begin,
        Token.PrimitiveType.Int,
        Token.Punctuation.TypeParameters.End,
        Token.Identifiers.LocalName("list"),
        Token.Punctuation.CloseParen,
        Token.Punctuation.OpenBrace,
        Token.Punctuation.CloseBrace,

        Token.Keywords.Control.If,
        Token.Punctuation.OpenParen,
        Token.Variables.ReadWrite("var"),
        Token.Operators.Pattern.Is,
        Token.PrimitiveType.Int,
        Token.Punctuation.OpenBracket,
        Token.Punctuation.Comma,
        Token.Punctuation.CloseBracket,
        Token.Identifiers.LocalName("arr"),
        Token.Punctuation.CloseParen,
        Token.Punctuation.OpenBrace,
        Token.Punctuation.CloseBrace,

        Token.Keywords.Control.If,
        Token.Punctuation.OpenParen,
        Token.Variables.ReadWrite("var"),
        Token.Operators.Pattern.Is,
        Token.Type("Dictionary"),
        Token.Punctuation.TypeParameters.Begin,
        Token.PrimitiveType.String,
        Token.Punctuation.Comma,
        Token.Type("List"),
        Token.Punctuation.TypeParameters.Begin,
        Token.PrimitiveType.Int,
        Token.Punctuation.TypeParameters.End,
        Token.Punctuation.TypeParameters.End,
        Token.Identifiers.LocalName("dict"),
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
        Token.Keywords.Control.If,
        Token.Punctuation.OpenParen,
        Token.Variables.ReadWrite("var"),
        Token.Operators.Pattern.Is,
        Token.Keywords.Var,
        Token.Identifiers.LocalName("var"),
        Token.Punctuation.CloseParen,
        Token.Punctuation.OpenBrace,
        Token.Punctuation.CloseBrace,

        Token.Keywords.Control.If,
        Token.Punctuation.OpenParen,
        Token.Variables.ReadWrite("var"),
        Token.Operators.Pattern.Is,
        Token.Keywords.Var,
        Token.Punctuation.OpenParen,
        Token.Identifiers.LocalName("var"),
        Token.Punctuation.Comma,
        Token.Identifiers.LocalName("var"),
        Token.Punctuation.CloseParen,
        Token.Punctuation.CloseParen,
        Token.Punctuation.OpenBrace,
        Token.Punctuation.CloseBrace,

        Token.Keywords.Control.If,
        Token.Punctuation.OpenParen,
        Token.Variables.ReadWrite("var"),
        Token.Operators.Pattern.Is,
        Token.Keywords.Var,
        Token.Variables.Discard,
        Token.Punctuation.CloseParen,
        Token.Punctuation.OpenBrace,
        Token.Punctuation.CloseBrace,

        Token.Keywords.Control.If,
        Token.Punctuation.OpenParen,
        Token.Variables.ReadWrite("var"),
        Token.Operators.Pattern.Is,
        Token.Keywords.Var,
        Token.Punctuation.OpenParen,
        Token.Identifiers.LocalName("var"),
        Token.Punctuation.Comma,
        Token.Variables.Discard,
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
        Token.Variables.ReadWrite("result"),
        Token.Operators.Assignment,
        Token.Variables.ReadWrite("obj"),
        Token.Operators.Pattern.Is,
        Token.PrimitiveType.String,
        Token.Punctuation.Semicolon,

        Token.Variables.ReadWrite("result"),
        Token.Operators.Assignment,
        Token.Variables.ReadWrite("obj"),
        Token.Operators.Pattern.Is,
        Token.Type("List"),
        Token.Punctuation.TypeParameters.Begin,
        Token.PrimitiveType.Int,
        Token.Punctuation.TypeParameters.End,
        Token.Punctuation.Semicolon,

        Token.Variables.ReadWrite("result"),
        Token.Operators.Assignment,
        Token.Variables.ReadWrite("obj"),
        Token.Operators.Pattern.Is,
        Token.PrimitiveType.Int,
        Token.Punctuation.OpenBracket,
        Token.Punctuation.Comma,
        Token.Punctuation.CloseBracket,
        Token.Punctuation.Semicolon,

        Token.Variables.ReadWrite("result"),
        Token.Operators.Assignment,
        Token.Variables.ReadWrite("obj"),
        Token.Operators.Pattern.Is,
        Token.Type("Dictionary"),
        Token.Punctuation.TypeParameters.Begin,
        Token.PrimitiveType.String,
        Token.Punctuation.Comma,
        Token.Type("List"),
        Token.Punctuation.TypeParameters.Begin,
        Token.PrimitiveType.Int,
        Token.Punctuation.TypeParameters.End,
        Token.Punctuation.TypeParameters.End,
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
        Token.Variables.ReadWrite("result"),
        Token.Operators.Assignment,
        Token.Punctuation.OpenParen,
        Token.Variables.ReadWrite("a"),
        Token.Punctuation.Comma,
        Token.Variables.ReadWrite("b"),
        Token.Punctuation.Comma,
        Token.Variables.ReadWrite("c"),
        Token.Punctuation.Comma,
        Token.Variables.ReadWrite("d"),
        Token.Punctuation.Comma,
        Token.Variables.ReadWrite("e"),
        Token.Punctuation.CloseParen,
        Token.Operators.Pattern.Is,
        Token.Punctuation.OpenParen,

        Token.Variables.Discard,
        Token.Punctuation.Comma,

        Token.Literals.Null,
        Token.Punctuation.Comma,

        Token.Variables.Property("c"),
        Token.Punctuation.Colon,
        Token.Operators.Relational.GreaterThan,
        Token.Literals.Numeric.Decimal("3"),
        Token.Punctuation.Comma,

        Token.PrimitiveType.String,
        Token.Identifiers.LocalName("str"),
        Token.Punctuation.Comma,

        Token.Variables.Property("e"),
        Token.Punctuation.Colon,
        Token.Type("List"),
        Token.Punctuation.TypeParameters.Begin,
        Token.PrimitiveType.Object,
        Token.Punctuation.TypeParameters.End,
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
        Token.Keywords.Control.If,
        Token.Punctuation.OpenParen,
        Token.Variables.ReadWrite("x"),
        Token.Operators.Pattern.Is,
        Token.Type("Foo"),
        Token.Punctuation.Accessor,
        Token.Type("Bar"),
        Token.Punctuation.OpenParen,
        Token.PrimitiveType.Int,
        Token.Punctuation.Comma,
        Token.Operators.Pattern.Not,
        Token.Literals.Null,
        Token.Punctuation.CloseParen,
        Token.Punctuation.OpenBrace,
        Token.Variables.Property("Data"),
        Token.Punctuation.Accessor,
        Token.Variables.Property("Length"),
        Token.Punctuation.Colon,
        Token.Operators.Relational.GreaterThan,
        Token.Literals.Numeric.Decimal("0"),
        Token.Punctuation.CloseBrace,
        Token.Identifiers.LocalName("y"),
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
        Token.Keywords.Control.If,
        Token.Punctuation.OpenParen,
        Token.Variables.ReadWrite("f"),
        Token.Operators.Pattern.Is,
        Token.Punctuation.OpenBrace,
        Token.Variables.Property("IsPreRelease"),
        Token.Punctuation.Colon,
        Token.Literals.Boolean.False,
        Token.Punctuation.Comma,
        Token.Variables.Property("FileName"),
        Token.Punctuation.Accessor,
        Token.Variables.Property("Length"),
        Token.Punctuation.Colon,
        Token.Operators.Relational.GreaterThan,
        Token.Literals.Numeric.Decimal("3"),
        Token.Operators.Pattern.And,
        Token.Operators.Relational.LessThan,
        Token.Literals.Numeric.Decimal("10"),
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
        Token.Keywords.Control.If,
        Token.Punctuation.OpenParen,
        Token.Variables.ReadWrite("o"),
        Token.Operators.Pattern.Is,
        Token.PrimitiveType.String,
        Token.Punctuation.OpenBrace,
        Token.Variables.Property("Length"),
        Token.Punctuation.Colon,
        Token.Literals.Numeric.Decimal("5"),
        Token.Punctuation.CloseBrace,
        Token.Identifiers.LocalName("s"),
        Token.Punctuation.CloseParen,
        Token.Punctuation.OpenBrace,
        Token.Punctuation.CloseBrace,

        Token.Keywords.Control.If,
        Token.Punctuation.OpenParen,
        Token.Variables.ReadWrite("f"),
        Token.Operators.Pattern.Is,
        Token.Type("System"),
        Token.Punctuation.Accessor,
        Token.Type("Diagnostics"),
        Token.Punctuation.Accessor,
        Token.Type("FileVersionInfo"),
        Token.Punctuation.OpenBrace,
        Token.Variables.Property("IsPreRelease"),
        Token.Punctuation.Colon,
        Token.Literals.Boolean.False,
        Token.Punctuation.Comma,
        Token.Variables.Property("FileName"),
        Token.Punctuation.Accessor,
        Token.Variables.Property("Length"),
        Token.Punctuation.Colon,
        Token.Operators.Relational.GreaterThan,
        Token.Literals.Numeric.Decimal("3"),
        Token.Operators.Pattern.And,
        Token.Operators.Relational.LessThan,
        Token.Literals.Numeric.Decimal("10"),
        Token.Punctuation.CloseBrace,
        Token.Punctuation.CloseParen,
        Token.Punctuation.OpenBrace,
        Token.Punctuation.CloseBrace,

        Token.Keywords.Control.If,
        Token.Punctuation.OpenParen,
        Token.Variables.ReadWrite("v"),
        Token.Operators.Pattern.Is,
        Token.Type("System"),
        Token.Punctuation.Accessor,
        Token.Type("Version"),
        Token.Punctuation.OpenBrace,
        Token.Variables.Property("Major"),
        Token.Punctuation.Colon,
        Token.Operators.Relational.GreaterThanOrEqual,
        Token.Literals.Numeric.Decimal("10"),
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
        Token.Keywords.Control.If,
        Token.Punctuation.OpenParen,
        Token.Variables.ReadWrite("array"),
        Token.Operators.Pattern.Is,
        Token.Punctuation.OpenBracket,
        Token.Literals.Numeric.Decimal("1"),
        Token.Punctuation.Comma,
        Token.Literals.Numeric.Decimal("2"),
        Token.Punctuation.Comma,
        Token.Literals.Numeric.Decimal("3"),
        Token.Punctuation.CloseBracket,
        Token.Identifiers.LocalName("x"),
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
        Token.Variables.ReadWrite("result"),
        Token.Operators.Assignment,
        Token.Variables.ReadWrite("array"),
        Token.Operators.Pattern.Is,
        Token.Punctuation.OpenBracket,
        Token.Variables.Discard,
        Token.Punctuation.Comma,
        Token.Literals.Numeric.Decimal("1"),
        Token.Punctuation.Comma,
        Token.Operators.Range,
        Token.Punctuation.OpenBrace,
        Token.Variables.Property("Length"),
        Token.Punctuation.Colon,
        Token.Operators.Relational.GreaterThan,
        Token.Literals.Numeric.Decimal("0"),
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
        Token.Variables.ReadWrite("result"),
        Token.Operators.Assignment,
        Token.Variables.ReadWrite("c"),
        Token.Operators.Pattern.Is,
        Token.Operators.Relational.GreaterThanOrEqual,
        Token.Punctuation.Char.Begin,
        Token.Literals.Char("a"),
        Token.Punctuation.Char.End,
        Token.Operators.Pattern.And,
        Token.Operators.Relational.LessThanOrEqual,
        Token.Punctuation.Char.Begin,
        Token.Literals.Char("z"),
        Token.Punctuation.Char.End,
        Token.Operators.Pattern.Or,
        Token.Operators.Relational.GreaterThanOrEqual,
        Token.Punctuation.Char.Begin,
        Token.Literals.Char("A"),
        Token.Punctuation.Char.End,
        Token.Operators.Pattern.And,
        Token.Operators.Relational.LessThanOrEqual,
        Token.Punctuation.Char.Begin,
        Token.Literals.Char("Z"),
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
        Token.Variables.ReadWrite("result"),
        Token.Operators.Assignment,
        Token.Variables.ReadWrite("c"),
        Token.Operators.Pattern.Is,
        Token.Punctuation.OpenParen,
        Token.Operators.Relational.GreaterThanOrEqual,
        Token.Punctuation.Char.Begin,
        Token.Literals.Char("a"),
        Token.Punctuation.Char.End,
        Token.Operators.Pattern.And,
        Token.Operators.Relational.LessThanOrEqual,
        Token.Punctuation.Char.Begin,
        Token.Literals.Char("z"),
        Token.Punctuation.Char.End,
        Token.Punctuation.CloseParen,
        Token.Operators.Pattern.Or,
        Token.Punctuation.OpenParen,
        Token.Operators.Relational.GreaterThanOrEqual,
        Token.Punctuation.Char.Begin,
        Token.Literals.Char("A"),
        Token.Punctuation.Char.End,
        Token.Operators.Pattern.And,
        Token.Operators.Relational.LessThanOrEqual,
        Token.Punctuation.Char.Begin,
        Token.Literals.Char("Z"),
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
        Token.Keywords.Control.Switch,
        Token.Punctuation.OpenParen,
        Token.Variables.ReadWrite("allPatterns"),
        Token.Punctuation.CloseParen,
        Token.Punctuation.OpenBrace,

        Token.Keywords.Control.Case,
        Token.Punctuation.OpenParen,
        Token.Operators.Relational.GreaterThanOrEqual,
        Token.Punctuation.Char.Begin,
        Token.Literals.Char("a"),
        Token.Punctuation.Char.End,
        Token.Operators.Pattern.And,
        Token.Operators.Relational.LessThanOrEqual,
        Token.Punctuation.Char.Begin,
        Token.Literals.Char("z"),
        Token.Punctuation.Char.End,
        Token.Punctuation.CloseParen,
        Token.Operators.Pattern.Or,
        Token.Punctuation.OpenParen,
        Token.Operators.Relational.GreaterThanOrEqual,
        Token.Punctuation.Char.Begin,
        Token.Literals.Char("A"),
        Token.Punctuation.Char.End,
        Token.Operators.Pattern.And,
        Token.Operators.Relational.LessThanOrEqual,
        Token.Punctuation.Char.Begin,
        Token.Literals.Char("Z"),
        Token.Punctuation.Char.End,
        Token.Punctuation.CloseParen,
        Token.Punctuation.Colon,

        Token.Keywords.Control.Case,
        Token.Operators.Relational.GreaterThanOrEqual,
        Token.Literals.Numeric.Decimal("0"),
        Token.Operators.Pattern.And,
        Token.Operators.Relational.LessThanOrEqual,
        Token.Literals.Numeric.Decimal("9"),
        Token.Operators.Pattern.Or,
        Token.Operators.Relational.GreaterThanOrEqual,
        Token.Literals.Numeric.Decimal("20"),
        Token.Operators.Pattern.And,
        Token.Operators.Relational.LessThanOrEqual,
        Token.Literals.Numeric.Decimal("29"),
        Token.Punctuation.Colon,

        Token.Keywords.Control.Case,
        Token.Punctuation.OpenBracket,
        Token.Variables.Discard,
        Token.Punctuation.Comma,
        Token.Literals.Numeric.Decimal("1"),
        Token.Punctuation.Comma,
        Token.Operators.Range,
        Token.Punctuation.OpenBrace,
        Token.Variables.Property("Length"),
        Token.Punctuation.Colon,
        Token.Operators.Relational.GreaterThan,
        Token.Literals.Numeric.Decimal("0"),
        Token.Punctuation.CloseBrace,
        Token.Punctuation.CloseBracket,
        Token.Punctuation.Colon,

        Token.Keywords.Control.Case,
        Token.Punctuation.OpenBracket,
        Token.Literals.Numeric.Decimal("1"),
        Token.Punctuation.Comma,
        Token.Literals.Numeric.Decimal("2"),
        Token.Punctuation.Comma,
        Token.Literals.Numeric.Decimal("3"),
        Token.Punctuation.CloseBracket,
        Token.Identifiers.LocalName("x"),
        Token.Punctuation.Colon,

        Token.Keywords.Control.Case,
        Token.PrimitiveType.String,
        Token.Punctuation.OpenBrace,
        Token.Variables.Property("Length"),
        Token.Punctuation.Colon,
        Token.Literals.Numeric.Decimal("5"),
        Token.Punctuation.CloseBrace,
        Token.Identifiers.LocalName("s"),
        Token.Punctuation.Colon,

        Token.Keywords.Control.Case,
        Token.Punctuation.OpenBrace,
        Token.Variables.Property("IsPreRelease"),
        Token.Punctuation.Colon,
        Token.Literals.Boolean.False,
        Token.Punctuation.Comma,
        Token.Variables.Property("FileName"),
        Token.Punctuation.Accessor,
        Token.Variables.Property("Length"),
        Token.Punctuation.Colon,
        Token.Operators.Relational.GreaterThan,
        Token.Literals.Numeric.Decimal("3"),
        Token.Operators.Pattern.And,
        Token.Operators.Relational.LessThan,
        Token.Literals.Numeric.Decimal("10"),
        Token.Punctuation.CloseBrace,
        Token.Punctuation.Colon,

        Token.Keywords.Control.Case,
        Token.Type("Foo"),
        Token.Punctuation.Accessor,
        Token.Type("Bar"),
        Token.Punctuation.OpenParen,
        Token.PrimitiveType.Int,
        Token.Punctuation.Comma,
        Token.Operators.Pattern.Not,
        Token.Literals.Null,
        Token.Punctuation.CloseParen,
        Token.Punctuation.OpenBrace,
        Token.Variables.Property("Data"),
        Token.Punctuation.Accessor,
        Token.Variables.Property("Length"),
        Token.Punctuation.Colon,
        Token.Operators.Relational.GreaterThan,
        Token.Literals.Numeric.Decimal("0"),
        Token.Punctuation.CloseBrace,
        Token.Identifiers.LocalName("y"),
        Token.Punctuation.Colon,

        Token.Keywords.Control.Case,
        Token.Punctuation.OpenParen,
        Token.Variables.Discard,
        Token.Punctuation.Comma,
        Token.Literals.Null,
        Token.Punctuation.Comma,
        Token.Variables.Property("c"),
        Token.Punctuation.Colon,
        Token.Operators.Relational.GreaterThan,
        Token.Literals.Numeric.Decimal("3"),
        Token.Punctuation.Comma,
        Token.PrimitiveType.String,
        Token.Identifiers.LocalName("str"),
        Token.Punctuation.Comma,
        Token.Variables.Property("e"),
        Token.Punctuation.Colon,
        Token.Type("List"),
        Token.Punctuation.TypeParameters.Begin,
        Token.PrimitiveType.Object,
        Token.Punctuation.TypeParameters.End,
        Token.Punctuation.Comma,
        Token.Punctuation.CloseParen,
        Token.Punctuation.Colon,

        Token.Keywords.Control.Case,
        Token.Type("Dictionary"),
        Token.Punctuation.TypeParameters.Begin,
        Token.PrimitiveType.String,
        Token.Punctuation.Comma,
        Token.Type("List"),
        Token.Punctuation.TypeParameters.Begin,
        Token.PrimitiveType.Int,
        Token.Punctuation.TypeParameters.End,
        Token.Punctuation.TypeParameters.End,
        Token.Punctuation.Colon,

        Token.Keywords.Control.Case,
        Token.PrimitiveType.Int,
        Token.Punctuation.OpenBracket,
        Token.Punctuation.Comma,
        Token.Punctuation.CloseBracket,
        Token.Identifiers.LocalName("arr"),
        Token.Punctuation.Colon,

        Token.Keywords.Control.Case,
        Token.Operators.Relational.GreaterThan,
        Token.Literals.Numeric.Decimal("0"),
        Token.Punctuation.Colon,

        Token.Keywords.Control.Case,
        Token.Literals.Null,
        Token.Punctuation.Colon,

        Token.Keywords.Control.Case,
        Token.Variables.Discard,
        Token.Punctuation.Colon,

        Token.Keywords.Control.Break,
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
        Token.Keywords.Control.Switch,
        Token.Punctuation.OpenParen,
        Token.Variables.ReadWrite("a"),
        Token.Punctuation.CloseParen,
        Token.Punctuation.OpenBrace,
        Token.Keywords.Control.Case,
        Token.PrimitiveType.String,
        Token.Identifiers.LocalName("str"),
        Token.Keywords.Control.When,
        Token.Variables.Object("str"),
        Token.Punctuation.Accessor,
        Token.Variables.Property("Length"),
        Token.Operators.Pattern.Is,
        Token.Operators.Relational.GreaterThan,
        Token.Literals.Numeric.Decimal("3"),
        Token.Operators.Pattern.And,
        Token.Operators.Pattern.Not,
        Token.Operators.Relational.GreaterThan,
        Token.Literals.Numeric.Decimal("8"),
        Token.Punctuation.Colon,
        Token.Keywords.Control.Break,
        Token.Punctuation.Semicolon,

        Token.Keywords.Control.Case,
        Token.Keywords.Var,
        Token.Punctuation.OpenParen,
        Token.Identifiers.LocalName("x"),
        Token.Punctuation.Comma,
        Token.Identifiers.LocalName("y"),
        Token.Punctuation.CloseParen,
        Token.Keywords.Control.When,
        Token.Variables.ReadWrite("x"),
        Token.Operators.Pattern.Is,
        Token.Operators.Pattern.Not,
        Token.Literals.Null,
        Token.Operators.Logical.And,
        Token.Variables.ReadWrite("y"),
        Token.Operators.Pattern.Is,
        Token.PrimitiveType.Int,
        Token.Punctuation.Colon,
        Token.Keywords.Control.Break,
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
        Token.Keywords.Control.Switch,
        Token.Punctuation.OpenParen,
        Token.Variables.ReadWrite("a"),
        Token.Punctuation.CloseParen,
        Token.Punctuation.OpenBrace,

        Token.Keywords.Control.Case,
        Token.PrimitiveType.String,
        Token.Punctuation.QuestionMark,
        Token.Identifiers.LocalName("str"),
        Token.Keywords.Control.When,
        Token.Variables.ReadWrite("str"),
        Token.Punctuation.Accessor,
        Token.Variables.Property("Length"),
        Token.Operators.Pattern.Is,
        Token.Operators.Relational.GreaterThan,
        Token.Literals.Numeric.Decimal("3"),
        Token.Operators.Pattern.And,
        Token.Operators.Pattern.Not,
        Token.Operators.Relational.GreaterThan,
        Token.Literals.Numeric.Decimal("8"),
        Token.Punctuation.Colon,
        Token.Keywords.Control.Break,
        Token.Punctuation.Semicolon,

        Token.Keywords.Control.Case,
        Token.Punctuation.String.Begin,
        Token.Punctuation.String.End,
        Token.Operators.Pattern.Or,
        Token.Literals.Null,
        Token.Operators.Pattern.Or,
        Token.Literals.Numeric.Decimal("0"),
        Token.Punctuation.Colon,
        Token.Keywords.Control.Break,
        Token.Punctuation.Semicolon,

        Token.Keywords.Control.Case,
        Token.Punctuation.OpenBrace,
        Token.Variables.Property("Length"),
        Token.Punctuation.Colon,
        Token.Operators.Relational.GreaterThan,
        Token.Literals.Numeric.Decimal("8"),
        Token.Operators.Pattern.Or,
        Token.Operators.Relational.LessThanOrEqual,
        Token.Literals.Numeric.Decimal("2"),
        Token.Punctuation.CloseBrace,
        Token.Punctuation.Colon,
        Token.Keywords.Control.Break,
        Token.Punctuation.Semicolon,

        Token.Keywords.Control.Case,
        Token.Punctuation.OpenParen,
        Token.Variables.Property("first"),
        Token.Punctuation.Colon,
        Token.PrimitiveType.Int,
        Token.Punctuation.Comma,
        Token.Punctuation.OpenBrace,
        Token.Variables.Property("A"),
        Token.Punctuation.Colon,
        Token.Operators.Pattern.Not,
        Token.Literals.Null,
        Token.Punctuation.Comma,
        Token.Variables.Property("B"),
        Token.Punctuation.Accessor,
        Token.Variables.Property("C"),
        Token.Punctuation.Colon,
        Token.PrimitiveType.String,
        Token.Punctuation.CloseBrace,
        Token.Punctuation.CloseParen,
        Token.Punctuation.Colon,
        Token.Keywords.Control.Break,
        Token.Punctuation.Semicolon,

        Token.Keywords.Control.Case,
        Token.Identifiers.AliasName("global"),
        Token.Punctuation.ColonColon,
        Token.Type("System"),
        Token.Punctuation.Accessor,
        Token.Type("Collections"),
        Token.Punctuation.Accessor,
        Token.Type("Generic"),
        Token.Punctuation.Accessor,
        Token.Type("List"),
        Token.Punctuation.TypeParameters.Begin,
        Token.PrimitiveType.Int,
        Token.Punctuation.TypeParameters.End,
        Token.Punctuation.OpenBracket,
        Token.Punctuation.CloseBracket,
        Token.Punctuation.Colon,
        Token.Keywords.Control.Break,
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
        Token.Keywords.Modifiers.Public,
        Token.PrimitiveType.Decimal,
        Token.Identifiers.MethodName("Calculate"),
        Token.Punctuation.OpenParen,
        Token.PrimitiveType.Object,
        Token.Identifiers.ParameterName("thing"),
        Token.Punctuation.CloseParen,
        Token.Operators.Arrow,
        Token.Variables.ReadWrite("thing"),
        Token.Keywords.Control.Switch,
        Token.Punctuation.OpenBrace,
        Token.Type("Car"),
        Token.Identifiers.LocalName("c"),
        Token.Operators.Arrow,
        Token.Literals.Numeric.Decimal("2"),
        Token.Literals.Numeric.Other.Separator.Decimals,
        Token.Literals.Numeric.Decimal("00"),
        Token.Literals.Numeric.Other.Suffix("m"),
        Token.Operators.Arithmetic.Subtraction,
        Token.Literals.Numeric.Decimal("1"),
        Token.Literals.Numeric.Other.Separator.Decimals,
        Token.Literals.Numeric.Decimal("0"),
        Token.Literals.Numeric.Other.Suffix("m"),
        Token.Punctuation.Comma,
        Token.Type("Bus"),
        Token.Identifiers.LocalName("b"),
        Token.Keywords.Control.When,
        Token.Punctuation.OpenParen,
        Token.Punctuation.OpenParen,
        Token.PrimitiveType.Double,
        Token.Punctuation.CloseParen,
        Token.Variables.Object("b"),
        Token.Punctuation.Accessor,
        Token.Variables.Property("Riders"),
        Token.Operators.Arithmetic.Division,
        Token.Punctuation.OpenParen,
        Token.PrimitiveType.Double,
        Token.Punctuation.CloseParen,
        Token.Variables.Object("b"),
        Token.Punctuation.Accessor,
        Token.Variables.Property("Capacity"),
        Token.Punctuation.CloseParen,
        Token.Operators.Relational.LessThan,
        Token.Literals.Numeric.Decimal("0"),
        Token.Literals.Numeric.Other.Separator.Decimals,
        Token.Literals.Numeric.Decimal("50"),
        Token.Operators.Arrow,
        Token.Literals.Numeric.Decimal("5"),
        Token.Literals.Numeric.Other.Separator.Decimals,
        Token.Literals.Numeric.Decimal("00"),
        Token.Literals.Numeric.Other.Suffix("m"),
        Token.Operators.Arithmetic.Addition,
        Token.Literals.Numeric.Decimal("2"),
        Token.Literals.Numeric.Other.Separator.Decimals,
        Token.Literals.Numeric.Decimal("00"),
        Token.Literals.Numeric.Other.Suffix("m"),
        Token.Punctuation.Comma,
        Token.Type("Bus"),
        Token.Identifiers.LocalName("b"),
        Token.Operators.Arrow,
        Token.Literals.Numeric.Decimal("5"),
        Token.Literals.Numeric.Other.Separator.Decimals,
        Token.Literals.Numeric.Decimal("00"),
        Token.Literals.Numeric.Other.Suffix("m"),
        Token.Punctuation.Comma,
        Token.Punctuation.OpenBrace,
        Token.Punctuation.CloseBrace,
        Token.Operators.Arrow,
        Token.Keywords.Control.Throw,
        Token.Keywords.New,
        Token.Type("ArgumentException"),
        Token.Punctuation.OpenParen,
        Token.Identifiers.ParameterName("message"),
        Token.Punctuation.Colon,
        Token.Punctuation.String.Begin,
        Token.Literals.String("Not a known vehicle type"),
        Token.Punctuation.String.End,
        Token.Punctuation.Comma,
        Token.Identifiers.ParameterName("paramName"),
        Token.Punctuation.Colon,
        Token.Keywords.NameOf,
        Token.Punctuation.OpenParen,
        Token.Variables.ReadWrite("vehicle"),
        Token.Punctuation.CloseParen,
        Token.Punctuation.CloseParen,
        Token.Punctuation.Comma,
        Token.Literals.Null,
        Token.Operators.Arrow,
        Token.Keywords.Control.Throw,
        Token.Keywords.New,
        Token.Type("ArgumentNullException"),
        Token.Punctuation.OpenParen,
        Token.Keywords.NameOf,
        Token.Punctuation.OpenParen,
        Token.Variables.ReadWrite("vehicle"),
        Token.Punctuation.CloseParen,
        Token.Punctuation.CloseParen,
        Token.Punctuation.Comma,
        Token.Variables.Discard,
        Token.Operators.Arrow,
        Token.Literals.Numeric.Decimal("3"),
        Token.Literals.Numeric.Other.Separator.Decimals,
        Token.Literals.Numeric.Decimal("50"),
        Token.Literals.Numeric.Other.Suffix("m"),
        Token.Operators.Arithmetic.Subtraction,
        Token.Literals.Numeric.Decimal("1"),
        Token.Literals.Numeric.Other.Separator.Decimals,
        Token.Literals.Numeric.Decimal("00"),
        Token.Literals.Numeric.Other.Suffix("m"),
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
        Token.Keywords.Modifiers.Public,
        Token.Keywords.Modifiers.Static,
        Token.Type("RGBColor"),
        Token.Identifiers.MethodName("FromRainbow"),
        Token.Punctuation.OpenParen,
        Token.Type("Rainbow"),
        Token.Identifiers.ParameterName("colorBand"),
        Token.Punctuation.CloseParen,
        Token.Operators.Arrow,
        Token.Variables.ReadWrite("colorBand"),
        Token.Keywords.Control.Switch,
        Token.Punctuation.OpenBrace,
        Token.Type("Rainbow"),
        Token.Punctuation.Accessor,
        Token.Type("Red"),
        Token.Operators.Arrow,
        Token.Keywords.New,
        Token.Type("RGBColor"),
        Token.Punctuation.OpenParen,
        Token.Literals.Numeric.Other.Preffix.Hexadecimal("0x"),
        Token.Literals.Numeric.Hexadecimal("FF"),
        Token.Punctuation.Comma,
        Token.Literals.Numeric.Other.Preffix.Hexadecimal("0x"),
        Token.Literals.Numeric.Hexadecimal("00"),
        Token.Punctuation.Comma,
        Token.Literals.Numeric.Other.Preffix.Hexadecimal("0x"),
        Token.Literals.Numeric.Hexadecimal("00"),
        Token.Punctuation.CloseParen,
        Token.Punctuation.Comma,
        Token.Type("Rainbow"),
        Token.Punctuation.Accessor,
        Token.Type("Orange"),
        Token.Operators.Arrow,
        Token.Keywords.New,
        Token.Type("RGBColor"),
        Token.Punctuation.OpenParen,
        Token.Literals.Numeric.Other.Preffix.Hexadecimal("0x"),
        Token.Literals.Numeric.Hexadecimal("FF"),
        Token.Punctuation.Comma,
        Token.Literals.Numeric.Other.Preffix.Hexadecimal("0x"),
        Token.Literals.Numeric.Hexadecimal("7F"),
        Token.Punctuation.Comma,
        Token.Literals.Numeric.Other.Preffix.Hexadecimal("0x"),
        Token.Literals.Numeric.Hexadecimal("00"),
        Token.Punctuation.CloseParen,
        Token.Punctuation.Comma,
        Token.Type("Rainbow"),
        Token.Punctuation.Accessor,
        Token.Type("Yellow"),
        Token.Operators.Arrow,
        Token.Keywords.New,
        Token.Type("RGBColor"),
        Token.Punctuation.OpenParen,
        Token.Literals.Numeric.Other.Preffix.Hexadecimal("0x"),
        Token.Literals.Numeric.Hexadecimal("FF"),
        Token.Punctuation.Comma,
        Token.Literals.Numeric.Other.Preffix.Hexadecimal("0x"),
        Token.Literals.Numeric.Hexadecimal("FF"),
        Token.Punctuation.Comma,
        Token.Literals.Numeric.Other.Preffix.Hexadecimal("0x"),
        Token.Literals.Numeric.Hexadecimal("00"),
        Token.Punctuation.CloseParen,
        Token.Punctuation.Comma,
        Token.Type("Rainbow"),
        Token.Punctuation.Accessor,
        Token.Type("Green"),
        Token.Operators.Arrow,
        Token.Keywords.New,
        Token.Type("RGBColor"),
        Token.Punctuation.OpenParen,
        Token.Literals.Numeric.Other.Preffix.Hexadecimal("0x"),
        Token.Literals.Numeric.Hexadecimal("00"),
        Token.Punctuation.Comma,
        Token.Literals.Numeric.Other.Preffix.Hexadecimal("0x"),
        Token.Literals.Numeric.Hexadecimal("FF"),
        Token.Punctuation.Comma,
        Token.Literals.Numeric.Other.Preffix.Hexadecimal("0x"),
        Token.Literals.Numeric.Hexadecimal("00"),
        Token.Punctuation.CloseParen,
        Token.Punctuation.Comma,
        Token.Type("Rainbow"),
        Token.Punctuation.Accessor,
        Token.Type("Blue"),
        Token.Operators.Arrow,
        Token.Keywords.New,
        Token.Type("RGBColor"),
        Token.Punctuation.OpenParen,
        Token.Literals.Numeric.Other.Preffix.Hexadecimal("0x"),
        Token.Literals.Numeric.Hexadecimal("00"),
        Token.Punctuation.Comma,
        Token.Literals.Numeric.Other.Preffix.Hexadecimal("0x"),
        Token.Literals.Numeric.Hexadecimal("00"),
        Token.Punctuation.Comma,
        Token.Literals.Numeric.Other.Preffix.Hexadecimal("0x"),
        Token.Literals.Numeric.Hexadecimal("FF"),
        Token.Punctuation.CloseParen,
        Token.Punctuation.Comma,
        Token.Type("Rainbow"),
        Token.Punctuation.Accessor,
        Token.Type("Indigo"),
        Token.Operators.Arrow,
        Token.Keywords.New,
        Token.Type("RGBColor"),
        Token.Punctuation.OpenParen,
        Token.Literals.Numeric.Other.Preffix.Hexadecimal("0x"),
        Token.Literals.Numeric.Hexadecimal("4B"),
        Token.Punctuation.Comma,
        Token.Literals.Numeric.Other.Preffix.Hexadecimal("0x"),
        Token.Literals.Numeric.Hexadecimal("00"),
        Token.Punctuation.Comma,
        Token.Literals.Numeric.Other.Preffix.Hexadecimal("0x"),
        Token.Literals.Numeric.Hexadecimal("82"),
        Token.Punctuation.CloseParen,
        Token.Punctuation.Comma,
        Token.Type("Rainbow"),
        Token.Punctuation.Accessor,
        Token.Type("Violet"),
        Token.Operators.Arrow,
        Token.Keywords.New,
        Token.Type("RGBColor"),
        Token.Punctuation.OpenParen,
        Token.Literals.Numeric.Other.Preffix.Hexadecimal("0x"),
        Token.Literals.Numeric.Hexadecimal("94"),
        Token.Punctuation.Comma,
        Token.Literals.Numeric.Other.Preffix.Hexadecimal("0x"),
        Token.Literals.Numeric.Hexadecimal("00"),
        Token.Punctuation.Comma,
        Token.Literals.Numeric.Other.Preffix.Hexadecimal("0x"),
        Token.Literals.Numeric.Hexadecimal("D3"),
        Token.Punctuation.CloseParen,
        Token.Punctuation.Comma,
        Token.Variables.Discard,
        Token.Operators.Arrow,
        Token.Keywords.Control.Throw,
        Token.Keywords.New,
        Token.Type("ArgumentException"),
        Token.Punctuation.OpenParen,
        Token.Identifiers.ParameterName("message"),
        Token.Punctuation.Colon,
        Token.Punctuation.String.Begin,
        Token.Literals.String("invalid enum value"),
        Token.Punctuation.String.End,
        Token.Punctuation.Comma,
        Token.Identifiers.ParameterName("paramName"),
        Token.Punctuation.Colon,
        Token.Keywords.NameOf,
        Token.Punctuation.OpenParen,
        Token.Variables.ReadWrite("colorBand"),
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
        Token.Keywords.Modifiers.Public,
        Token.Keywords.Modifiers.Static,
        Token.PrimitiveType.Decimal,
        Token.Identifiers.MethodName("ComputeSalesTax"),
        Token.Punctuation.OpenParen,
        Token.Type("Address"),
        Token.Identifiers.ParameterName("location"),
        Token.Punctuation.Comma,
        Token.PrimitiveType.Decimal,
        Token.Identifiers.ParameterName("salePrice"),
        Token.Punctuation.CloseParen,
        Token.Operators.Arrow,
        Token.Variables.ReadWrite("location"),
        Token.Keywords.Control.Switch,
        Token.Punctuation.OpenBrace,
        Token.Punctuation.OpenBrace,
        Token.Variables.Property("State"),
        Token.Punctuation.Colon,
        Token.Punctuation.String.Begin,
        Token.Literals.String("WA"),
        Token.Punctuation.String.End,
        Token.Punctuation.CloseBrace,
        Token.Operators.Arrow,
        Token.Variables.ReadWrite("salePrice"),
        Token.Operators.Arithmetic.Multiplication,
        Token.Literals.Numeric.Decimal("0"),
        Token.Literals.Numeric.Other.Separator.Decimals,
        Token.Literals.Numeric.Decimal("06"),
        Token.Literals.Numeric.Other.Suffix("M"),
        Token.Punctuation.Comma,
        Token.Punctuation.OpenBrace,
        Token.Variables.Property("State"),
        Token.Punctuation.Colon,
        Token.Punctuation.String.Begin,
        Token.Literals.String("MN"),
        Token.Punctuation.String.End,
        Token.Punctuation.CloseBrace,
        Token.Operators.Arrow,
        Token.Variables.ReadWrite("salePrice"),
        Token.Operators.Arithmetic.Multiplication,
        Token.Literals.Numeric.Decimal("0"),
        Token.Literals.Numeric.Other.Separator.Decimals,
        Token.Literals.Numeric.Decimal("75"),
        Token.Literals.Numeric.Other.Suffix("M"),
        Token.Punctuation.Comma,
        Token.Punctuation.OpenBrace,
        Token.Variables.Property("State"),
        Token.Punctuation.Colon,
        Token.Punctuation.String.Begin,
        Token.Literals.String("MI"),
        Token.Punctuation.String.End,
        Token.Punctuation.CloseBrace,
        Token.Operators.Arrow,
        Token.Variables.ReadWrite("salePrice"),
        Token.Operators.Arithmetic.Multiplication,
        Token.Literals.Numeric.Decimal("0"),
        Token.Literals.Numeric.Other.Separator.Decimals,
        Token.Literals.Numeric.Decimal("05"),
        Token.Literals.Numeric.Other.Suffix("M"),
        Token.Punctuation.Comma,
        Token.Comment.LeadingWhitespace("      "),
        Token.Comment.SingleLine.Start,
        Token.Comment.SingleLine.Text(" other cases removed for brevity..."),
        Token.Variables.Discard,
        Token.Operators.Arrow,
        Token.Literals.Numeric.Decimal("0"),
        Token.Literals.Numeric.Other.Suffix("M"),
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
        Token.Keywords.Modifiers.Public,
        Token.Keywords.Modifiers.Static,
        Token.PrimitiveType.String,
        Token.Identifiers.MethodName("RockPaperScissors"),
        Token.Punctuation.OpenParen,
        Token.PrimitiveType.String,
        Token.Identifiers.ParameterName("first"),
        Token.Punctuation.Comma,
        Token.PrimitiveType.String,
        Token.Identifiers.ParameterName("second"),
        Token.Punctuation.CloseParen,
        Token.Operators.Arrow,
        Token.Punctuation.OpenParen,
        Token.Variables.ReadWrite("first"),
        Token.Punctuation.Comma,
        Token.Variables.ReadWrite("second"),
        Token.Punctuation.CloseParen,
        Token.Keywords.Control.Switch,
        Token.Punctuation.OpenBrace,
        Token.Punctuation.OpenParen,
        Token.Punctuation.String.Begin,
        Token.Literals.String("rock"),
        Token.Punctuation.String.End,
        Token.Punctuation.Comma,
        Token.Punctuation.String.Begin,
        Token.Literals.String("paper"),
        Token.Punctuation.String.End,
        Token.Punctuation.CloseParen,
        Token.Operators.Arrow,
        Token.Punctuation.String.Begin,
        Token.Literals.String("rock is covered by paper. Paper wins."),
        Token.Punctuation.String.End,
        Token.Punctuation.Comma,
        Token.Punctuation.OpenParen,
        Token.Punctuation.String.Begin,
        Token.Literals.String("rock"),
        Token.Punctuation.String.End,
        Token.Punctuation.Comma,
        Token.Punctuation.String.Begin,
        Token.Literals.String("scissors"),
        Token.Punctuation.String.End,
        Token.Punctuation.CloseParen,
        Token.Operators.Arrow,
        Token.Punctuation.String.Begin,
        Token.Literals.String("rock breaks scissors. Rock wins."),
        Token.Punctuation.String.End,
        Token.Punctuation.Comma,
        Token.Punctuation.OpenParen,
        Token.Punctuation.String.Begin,
        Token.Literals.String("paper"),
        Token.Punctuation.String.End,
        Token.Punctuation.Comma,
        Token.Punctuation.String.Begin,
        Token.Literals.String("rock"),
        Token.Punctuation.String.End,
        Token.Punctuation.CloseParen,
        Token.Operators.Arrow,
        Token.Punctuation.String.Begin,
        Token.Literals.String("paper covers rock. Paper wins."),
        Token.Punctuation.String.End,
        Token.Punctuation.Comma,
        Token.Punctuation.OpenParen,
        Token.Punctuation.String.Begin,
        Token.Literals.String("paper"),
        Token.Punctuation.String.End,
        Token.Punctuation.Comma,
        Token.Punctuation.String.Begin,
        Token.Literals.String("scissors"),
        Token.Punctuation.String.End,
        Token.Punctuation.CloseParen,
        Token.Operators.Arrow,
        Token.Punctuation.String.Begin,
        Token.Literals.String("paper is cut by scissors. Scissors wins."),
        Token.Punctuation.String.End,
        Token.Punctuation.Comma,
        Token.Punctuation.OpenParen,
        Token.Punctuation.String.Begin,
        Token.Literals.String("scissors"),
        Token.Punctuation.String.End,
        Token.Punctuation.Comma,
        Token.Punctuation.String.Begin,
        Token.Literals.String("rock"),
        Token.Punctuation.String.End,
        Token.Punctuation.CloseParen,
        Token.Operators.Arrow,
        Token.Punctuation.String.Begin,
        Token.Literals.String("scissors is broken by rock. Rock wins."),
        Token.Punctuation.String.End,
        Token.Punctuation.Comma,
        Token.Punctuation.OpenParen,
        Token.Punctuation.String.Begin,
        Token.Literals.String("scissors"),
        Token.Punctuation.String.End,
        Token.Punctuation.Comma,
        Token.Punctuation.String.Begin,
        Token.Literals.String("paper"),
        Token.Punctuation.String.End,
        Token.Punctuation.CloseParen,
        Token.Operators.Arrow,
        Token.Punctuation.String.Begin,
        Token.Literals.String("scissors cuts paper. Scissors wins."),
        Token.Punctuation.String.End,
        Token.Punctuation.Comma,
        Token.Punctuation.OpenParen,
        Token.Variables.Discard,
        Token.Punctuation.Comma,
        Token.Variables.Discard,
        Token.Punctuation.CloseParen,
        Token.Operators.Arrow,
        Token.Punctuation.String.Begin,
        Token.Literals.String("tie"),
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
        Token.Keywords.Modifiers.Public,
        Token.Keywords.Modifiers.Static,
        Token.Type("Quadrant"),
        Token.Identifiers.MethodName("GetQuadrant"),
        Token.Punctuation.OpenParen,
        Token.Type("Point"),
        Token.Identifiers.ParameterName("point"),
        Token.Punctuation.CloseParen,
        Token.Operators.Arrow,
        Token.Variables.ReadWrite("point"),
        Token.Keywords.Control.Switch,
        Token.Punctuation.OpenBrace,
        Token.Punctuation.OpenParen,
        Token.Literals.Numeric.Decimal("0"),
        Token.Punctuation.Comma,
        Token.Literals.Numeric.Decimal("0"),
        Token.Punctuation.CloseParen,
        Token.Operators.Arrow,
        Token.Variables.Object("Quadrant"),
        Token.Punctuation.Accessor,
        Token.Variables.Property("Origin"),
        Token.Punctuation.Comma,
        Token.Keywords.Var,
        Token.Punctuation.OpenParen,
        Token.Identifiers.LocalName("x"),
        Token.Punctuation.Comma,
        Token.Identifiers.LocalName("y"),
        Token.Punctuation.CloseParen,
        Token.Keywords.Control.When,
        Token.Variables.ReadWrite("x"),
        Token.Operators.Relational.GreaterThan,
        Token.Literals.Numeric.Decimal("0"),
        Token.Operators.Logical.And,
        Token.Variables.ReadWrite("y"),
        Token.Operators.Relational.GreaterThan,
        Token.Literals.Numeric.Decimal("0"),
        Token.Operators.Arrow,
        Token.Variables.Object("Quadrant"),
        Token.Punctuation.Accessor,
        Token.Variables.Property("One"),
        Token.Punctuation.Comma,
        Token.Keywords.Var,
        Token.Punctuation.OpenParen,
        Token.Identifiers.LocalName("x"),
        Token.Punctuation.Comma,
        Token.Identifiers.LocalName("y"),
        Token.Punctuation.CloseParen,
        Token.Keywords.Control.When,
        Token.Variables.ReadWrite("x"),
        Token.Operators.Relational.LessThan,
        Token.Literals.Numeric.Decimal("0"),
        Token.Operators.Logical.And,
        Token.Variables.ReadWrite("y"),
        Token.Operators.Relational.GreaterThan,
        Token.Literals.Numeric.Decimal("0"),
        Token.Operators.Arrow,
        Token.Variables.Object("Quadrant"),
        Token.Punctuation.Accessor,
        Token.Variables.Property("Two"),
        Token.Punctuation.Comma,
        Token.Keywords.Var,
        Token.Punctuation.OpenParen,
        Token.Identifiers.LocalName("x"),
        Token.Punctuation.Comma,
        Token.Identifiers.LocalName("y"),
        Token.Punctuation.CloseParen,
        Token.Keywords.Control.When,
        Token.Variables.ReadWrite("x"),
        Token.Operators.Relational.LessThan,
        Token.Literals.Numeric.Decimal("0"),
        Token.Operators.Logical.And,
        Token.Variables.ReadWrite("y"),
        Token.Operators.Relational.LessThan,
        Token.Literals.Numeric.Decimal("0"),
        Token.Operators.Arrow,
        Token.Variables.Object("Quadrant"),
        Token.Punctuation.Accessor,
        Token.Variables.Property("Three"),
        Token.Punctuation.Comma,
        Token.Keywords.Var,
        Token.Punctuation.OpenParen,
        Token.Identifiers.LocalName("x"),
        Token.Punctuation.Comma,
        Token.Identifiers.LocalName("y"),
        Token.Punctuation.CloseParen,
        Token.Keywords.Control.When,
        Token.Variables.ReadWrite("x"),
        Token.Operators.Relational.GreaterThan,
        Token.Literals.Numeric.Decimal("0"),
        Token.Operators.Logical.And,
        Token.Variables.ReadWrite("y"),
        Token.Operators.Relational.LessThan,
        Token.Literals.Numeric.Decimal("0"),
        Token.Operators.Arrow,
        Token.Variables.Object("Quadrant"),
        Token.Punctuation.Accessor,
        Token.Variables.Property("Four"),
        Token.Punctuation.Comma,
        Token.Keywords.Var,
        Token.Punctuation.OpenParen,
        Token.Variables.Discard,
        Token.Punctuation.Comma,
        Token.Variables.Discard,
        Token.Punctuation.CloseParen,
        Token.Operators.Arrow,
        Token.Variables.Object("Quadrant"),
        Token.Punctuation.Accessor,
        Token.Variables.Property("OnBorder"),
        Token.Punctuation.Comma,
        Token.Variables.Discard,
        Token.Operators.Arrow,
        Token.Variables.Object("Quadrant"),
        Token.Punctuation.Accessor,
        Token.Variables.Property("Unknown"),
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
        Token.Keywords.Modifiers.Public,
        Token.PrimitiveType.Decimal,
        Token.Identifiers.MethodName("CalculateToll"),
        Token.Punctuation.OpenParen,
        Token.PrimitiveType.Object,
        Token.Identifiers.ParameterName("vehicle"),
        Token.Punctuation.CloseParen,
        Token.Operators.Arrow,
        Token.Variables.ReadWrite("vehicle"),
        Token.Keywords.Control.Switch,
        Token.Punctuation.OpenBrace,
        Token.Type("Car"),
        Token.Identifiers.LocalName("c"),
        Token.Operators.Arrow,
        Token.Variables.Object("c"),
        Token.Punctuation.Accessor,
        Token.Variables.Property("Passengers"),
        Token.Keywords.Control.Switch,
        Token.Punctuation.OpenBrace,
        Token.Literals.Numeric.Decimal("0"),
        Token.Operators.Arrow,
        Token.Literals.Numeric.Decimal("2"),
        Token.Literals.Numeric.Other.Separator.Decimals,
        Token.Literals.Numeric.Decimal("00"),
        Token.Literals.Numeric.Other.Suffix("m"),
        Token.Operators.Arithmetic.Addition,
        Token.Literals.Numeric.Decimal("0"),
        Token.Literals.Numeric.Other.Separator.Decimals,
        Token.Literals.Numeric.Decimal("50"),
        Token.Literals.Numeric.Other.Suffix("m"),
        Token.Punctuation.Comma,
        Token.Literals.Numeric.Decimal("1"),
        Token.Operators.Arrow,
        Token.Literals.Numeric.Decimal("2"),
        Token.Literals.Numeric.Other.Separator.Decimals,
        Token.Literals.Numeric.Decimal("0"),
        Token.Literals.Numeric.Other.Suffix("m"),
        Token.Punctuation.Comma,
        Token.Literals.Numeric.Decimal("2"),
        Token.Operators.Arrow,
        Token.Literals.Numeric.Decimal("2"),
        Token.Literals.Numeric.Other.Separator.Decimals,
        Token.Literals.Numeric.Decimal("0"),
        Token.Literals.Numeric.Other.Suffix("m"),
        Token.Operators.Arithmetic.Subtraction,
        Token.Literals.Numeric.Decimal("0"),
        Token.Literals.Numeric.Other.Separator.Decimals,
        Token.Literals.Numeric.Decimal("50"),
        Token.Literals.Numeric.Other.Suffix("m"),
        Token.Punctuation.Comma,
        Token.Variables.Discard,
        Token.Operators.Arrow,
        Token.Literals.Numeric.Decimal("2"),
        Token.Literals.Numeric.Other.Separator.Decimals,
        Token.Literals.Numeric.Decimal("00"),
        Token.Literals.Numeric.Other.Suffix("m"),
        Token.Operators.Arithmetic.Subtraction,
        Token.Literals.Numeric.Decimal("1"),
        Token.Literals.Numeric.Other.Separator.Decimals,
        Token.Literals.Numeric.Decimal("0"),
        Token.Literals.Numeric.Other.Suffix("m"),
        Token.Punctuation.Comma,
        Token.Punctuation.CloseBrace,
        Token.Punctuation.Comma,
        Token.Type("Taxi"),
        Token.Punctuation.OpenBrace,
        Token.Variables.Property("Fares"),
        Token.Punctuation.Colon,
        Token.Literals.Numeric.Decimal("0"),
        Token.Punctuation.CloseBrace,
        Token.Operators.Arrow,
        Token.Literals.Numeric.Decimal("3"),
        Token.Literals.Numeric.Other.Separator.Decimals,
        Token.Literals.Numeric.Decimal("50"),
        Token.Literals.Numeric.Other.Suffix("m"),
        Token.Operators.Arithmetic.Addition,
        Token.Literals.Numeric.Decimal("1"),
        Token.Literals.Numeric.Other.Separator.Decimals,
        Token.Literals.Numeric.Decimal("00"),
        Token.Literals.Numeric.Other.Suffix("m"),
        Token.Punctuation.Comma,
        Token.Type("Taxi"),
        Token.Punctuation.OpenBrace,
        Token.Variables.Property("Fares"),
        Token.Punctuation.Colon,
        Token.Literals.Numeric.Decimal("1"),
        Token.Punctuation.CloseBrace,
        Token.Operators.Arrow,
        Token.Literals.Numeric.Decimal("3"),
        Token.Literals.Numeric.Other.Separator.Decimals,
        Token.Literals.Numeric.Decimal("50"),
        Token.Literals.Numeric.Other.Suffix("m"),
        Token.Punctuation.Comma,
        Token.Type("Taxi"),
        Token.Punctuation.OpenBrace,
        Token.Variables.Property("Fares"),
        Token.Punctuation.Colon,
        Token.Literals.Numeric.Decimal("2"),
        Token.Punctuation.CloseBrace,
        Token.Operators.Arrow,
        Token.Literals.Numeric.Decimal("3"),
        Token.Literals.Numeric.Other.Separator.Decimals,
        Token.Literals.Numeric.Decimal("50"),
        Token.Literals.Numeric.Other.Suffix("m"),
        Token.Operators.Arithmetic.Subtraction,
        Token.Literals.Numeric.Decimal("0"),
        Token.Literals.Numeric.Other.Separator.Decimals,
        Token.Literals.Numeric.Decimal("50"),
        Token.Literals.Numeric.Other.Suffix("m"),
        Token.Punctuation.Comma,
        Token.Type("Taxi"),
        Token.Identifiers.LocalName("t"),
        Token.Operators.Arrow,
        Token.Literals.Numeric.Decimal("3"),
        Token.Literals.Numeric.Other.Separator.Decimals,
        Token.Literals.Numeric.Decimal("50"),
        Token.Literals.Numeric.Other.Suffix("m"),
        Token.Operators.Arithmetic.Subtraction,
        Token.Literals.Numeric.Decimal("1"),
        Token.Literals.Numeric.Other.Separator.Decimals,
        Token.Literals.Numeric.Decimal("00"),
        Token.Literals.Numeric.Other.Suffix("m"),
        Token.Punctuation.Comma,
        Token.Type("Bus"),
        Token.Identifiers.LocalName("b"),
        Token.Keywords.Control.When,
        Token.Punctuation.OpenParen,
        Token.PrimitiveType.Double,
        Token.Punctuation.CloseParen,
        Token.Variables.Object("b"),
        Token.Punctuation.Accessor,
        Token.Variables.Property("Riders"),
        Token.Operators.Arithmetic.Division,
        Token.Punctuation.OpenParen,
        Token.PrimitiveType.Double,
        Token.Punctuation.CloseParen,
        Token.Variables.Object("b"),
        Token.Punctuation.Accessor,
        Token.Variables.Property("Capacity"),
        Token.Operators.Relational.LessThan,
        Token.Literals.Numeric.Decimal("0"),
        Token.Literals.Numeric.Other.Separator.Decimals,
        Token.Literals.Numeric.Decimal("50"),
        Token.Operators.Arrow,
        Token.Literals.Numeric.Decimal("5"),
        Token.Literals.Numeric.Other.Separator.Decimals,
        Token.Literals.Numeric.Decimal("00"),
        Token.Literals.Numeric.Other.Suffix("m"),
        Token.Operators.Arithmetic.Addition,
        Token.Literals.Numeric.Decimal("2"),
        Token.Literals.Numeric.Other.Separator.Decimals,
        Token.Literals.Numeric.Decimal("00"),
        Token.Literals.Numeric.Other.Suffix("m"),
        Token.Punctuation.Comma,
        Token.Type("Bus"),
        Token.Identifiers.LocalName("b"),
        Token.Keywords.Control.When,
        Token.Punctuation.OpenParen,
        Token.Punctuation.OpenParen,
        Token.PrimitiveType.Double,
        Token.Punctuation.CloseParen,
        Token.Variables.Object("b"),
        Token.Punctuation.Accessor,
        Token.Variables.Property("Riders"),
        Token.Operators.Arithmetic.Division,
        Token.Punctuation.OpenParen,
        Token.PrimitiveType.Double,
        Token.Punctuation.CloseParen,
        Token.Variables.Object("b"),
        Token.Punctuation.Accessor,
        Token.Variables.Property("Capacity"),
        Token.Punctuation.CloseParen,
        Token.Operators.Relational.GreaterThan,
        Token.Literals.Numeric.Decimal("0"),
        Token.Literals.Numeric.Other.Separator.Decimals,
        Token.Literals.Numeric.Decimal("90"),
        Token.Operators.Arrow,
        Token.Literals.Numeric.Decimal("5"),
        Token.Literals.Numeric.Other.Separator.Decimals,
        Token.Literals.Numeric.Decimal("00"),
        Token.Literals.Numeric.Other.Suffix("m"),
        Token.Operators.Arithmetic.Subtraction,
        Token.Literals.Numeric.Decimal("1"),
        Token.Literals.Numeric.Other.Separator.Decimals,
        Token.Literals.Numeric.Decimal("00"),
        Token.Literals.Numeric.Other.Suffix("m"),
        Token.Punctuation.Comma,
        Token.Type("Bus"),
        Token.Identifiers.LocalName("b"),
        Token.Operators.Arrow,
        Token.Literals.Numeric.Decimal("5"),
        Token.Literals.Numeric.Other.Separator.Decimals,
        Token.Literals.Numeric.Decimal("00"),
        Token.Literals.Numeric.Other.Suffix("m"),
        Token.Punctuation.Comma,
        Token.Type("DeliveryTruck"),
        Token.Identifiers.LocalName("t"),
        Token.Keywords.Control.When,
        Token.Punctuation.OpenParen,
        Token.Variables.Object("t"),
        Token.Punctuation.Accessor,
        Token.Variables.Property("GrossWeightClass"),
        Token.Operators.Relational.GreaterThan,
        Token.Literals.Numeric.Decimal("5000"),
        Token.Punctuation.CloseParen,
        Token.Operators.Arrow,
        Token.Literals.Numeric.Decimal("10"),
        Token.Literals.Numeric.Other.Separator.Decimals,
        Token.Literals.Numeric.Decimal("00"),
        Token.Literals.Numeric.Other.Suffix("m"),
        Token.Operators.Arithmetic.Addition,
        Token.Literals.Numeric.Decimal("5"),
        Token.Literals.Numeric.Other.Separator.Decimals,
        Token.Literals.Numeric.Decimal("00"),
        Token.Literals.Numeric.Other.Suffix("m"),
        Token.Punctuation.Comma,
        Token.Type("DeliveryTruck"),
        Token.Identifiers.LocalName("t"),
        Token.Keywords.Control.When,
        Token.Punctuation.OpenParen,
        Token.Variables.Object("t"),
        Token.Punctuation.Accessor,
        Token.Variables.Property("GrossWeightClass"),
        Token.Operators.Relational.LessThan,
        Token.Literals.Numeric.Decimal("3000"),
        Token.Punctuation.CloseParen,
        Token.Operators.Arrow,
        Token.Literals.Numeric.Decimal("10"),
        Token.Literals.Numeric.Other.Separator.Decimals,
        Token.Literals.Numeric.Decimal("00"),
        Token.Literals.Numeric.Other.Suffix("m"),
        Token.Operators.Arithmetic.Subtraction,
        Token.Literals.Numeric.Decimal("2"),
        Token.Literals.Numeric.Other.Separator.Decimals,
        Token.Literals.Numeric.Decimal("00"),
        Token.Literals.Numeric.Other.Suffix("m"),
        Token.Punctuation.Comma,
        Token.Type("DeliveryTruck"),
        Token.Identifiers.LocalName("t"),
        Token.Operators.Arrow,
        Token.Literals.Numeric.Decimal("10"),
        Token.Literals.Numeric.Other.Separator.Decimals,
        Token.Literals.Numeric.Decimal("00"),
        Token.Literals.Numeric.Other.Suffix("m"),
        Token.Punctuation.Comma,
        Token.Literals.Null,
        Token.Operators.Arrow,
        Token.Keywords.Control.Throw,
        Token.Keywords.New,
        Token.Type("ArgumentNullException"),
        Token.Punctuation.OpenParen,
        Token.Keywords.NameOf,
        Token.Punctuation.OpenParen,
        Token.Variables.ReadWrite("vehicle"),
        Token.Punctuation.CloseParen,
        Token.Punctuation.CloseParen,
        Token.Punctuation.Comma,
        Token.Punctuation.OpenBrace,
        Token.Punctuation.CloseBrace,
        Token.Operators.Arrow,
        Token.Keywords.Control.Throw,
        Token.Keywords.New,
        Token.Type("ArgumentException"),
        Token.Punctuation.OpenParen,
        Token.Identifiers.ParameterName("message"),
        Token.Punctuation.Colon,
        Token.Punctuation.String.Begin,
        Token.Literals.String("Not a known vehicle type"),
        Token.Punctuation.String.End,
        Token.Punctuation.Comma,
        Token.Identifiers.ParameterName("paramName"),
        Token.Punctuation.Colon,
        Token.Keywords.NameOf,
        Token.Punctuation.OpenParen,
        Token.Variables.ReadWrite("vehicle"),
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
        Token.Keywords.Modifiers.Private,
        Token.PrimitiveType.Bool,
        Token.Identifiers.FieldName("switchedOn"),
        Token.Operators.Assignment,
        Token.Literals.Boolean.False,
        Token.Punctuation.Semicolon,
        Token.Keywords.Modifiers.Private,
        Token.PrimitiveType.Bool,
        Token.Identifiers.MethodName("DecodeSwitchString"),
        Token.Punctuation.OpenParen,
        Token.PrimitiveType.String,
        Token.Identifiers.ParameterName("switchString"),
        Token.Punctuation.CloseParen,
        Token.Punctuation.OpenBrace,
        Token.Keywords.Var,
        Token.Identifiers.LocalName("switchOn"),
        Token.Operators.Assignment,
        Token.Literals.Boolean.False,
        Token.Punctuation.Semicolon,
        Token.Keywords.Control.If,
        Token.Punctuation.OpenParen,
        Token.Operators.Logical.Not,
        Token.Variables.This,
        Token.Punctuation.Accessor,
        Token.Variables.Property("switchedOn"),
        Token.Punctuation.CloseParen,
        Token.Punctuation.OpenBrace,
        Token.Variables.ReadWrite("switchOn"),
        Token.Operators.Assignment,
        Token.Variables.Object("switchString"),
        Token.Punctuation.Accessor,
        Token.Identifiers.MethodName("ToUpper"),
        Token.Punctuation.OpenParen,
        Token.Punctuation.CloseParen,
        Token.Operators.Relational.Equals,
        Token.Punctuation.String.Begin,
        Token.Literals.String("ON"),
        Token.Punctuation.String.End,
        Token.Punctuation.Semicolon,
        Token.Punctuation.CloseBrace,
        Token.Keywords.Control.Return,
        Token.Variables.ReadWrite("switchOn"),
        Token.Punctuation.Semicolon,
        Token.Punctuation.CloseBrace
      ]);
    });
  });
});

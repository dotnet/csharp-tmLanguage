/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { should } from 'chai';
import { tokenize, Input, Token } from './utils/tokenize';

describe("Verbatim identifier", () => {
    before(() => { should() });

    describe("Verbatim identifier", () => {
        it("in extern alias directive", async () => {
            const input = `
extern alias @foo;
extern alias @class;
extern alias @namespace;
`;

            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Directive.Extern,
                Token.Keyword.Directive.Alias,
                Token.Variable.Alias("@foo"),
                Token.Punctuation.Semicolon,
                Token.Keyword.Directive.Extern,
                Token.Keyword.Directive.Alias,
                Token.Variable.Alias("@class"),
                Token.Punctuation.Semicolon,
                Token.Keyword.Directive.Extern,
                Token.Keyword.Directive.Alias,
                Token.Variable.Alias("@namespace"),
                Token.Punctuation.Semicolon]);
        });

        it("in using directive", async () => {
            const input = `
using @if;
using @class;
using @Foo.Bar;
using@Foo.Baz;
`;

            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Directive.Using,
                Token.Identifier.NamespaceName("@if"),
                Token.Punctuation.Semicolon,
                Token.Keyword.Directive.Using,
                Token.Identifier.NamespaceName("@class"),
                Token.Punctuation.Semicolon,
                Token.Keyword.Directive.Using,
                Token.Identifier.NamespaceName("@Foo"),
                Token.Identifier.NamespaceName("Bar"),
                Token.Punctuation.Semicolon,
                Token.Keyword.Directive.Using,
                Token.Identifier.NamespaceName("@Foo"),
                Token.Identifier.NamespaceName("Baz"),
                Token.Punctuation.Semicolon]);
        });

        it("in attribute's named argument", async () => {
            const input = `[Foo(@class = 1)]`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.OpenBracket,
                Token.Type("Foo"),
                Token.Punctuation.OpenParen,
                Token.Identifier.PropertyName("@class"),
                Token.Operator.Assignment,
                Token.Literal.Numeric.Decimal("1"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.CloseBracket]);
        });

        it("in namespace directive", async () => {
            const input = `
namespace @class
{
}
`;
            let tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Definition.Namespace,
                Token.Identifier.NamespaceName("@class"),
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace]);
        });

        it("in class declaration", async () => {
            const input = `
public class @class { }
public class @ClassName { }
`;
            let tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Modifier.Public,
                Token.Keyword.Definition.Class,
                Token.Identifier.ClassName("@class"),
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace,
                Token.Keyword.Modifier.Public,
                Token.Keyword.Definition.Class,
                Token.Identifier.ClassName("@ClassName"),
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace]);
        });

        it("in delegate declaration", async () => {
            const input = `delegate void @class();`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Definition.Delegate,
                Token.PrimitiveType.Void,
                Token.Identifier.DelegateName("@class"),
                Token.Punctuation.OpenParen,
                Token.Punctuation.CloseParen,
                Token.Punctuation.Semicolon]);
        });

        it("in enum declaration", async () => {
            const input = `enum @class { }`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Definition.Enum,
                Token.Identifier.EnumName("@class"),
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace]);
        });

        it("in enum member", async () => {
            const input = `
enum E
{
    @class = 1,
    @sufix,
    other
}
`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Definition.Enum,
                Token.Identifier.EnumName("E"),
                Token.Punctuation.OpenBrace,
                Token.Identifier.EnumMemberName("@class"),
                Token.Operator.Assignment,
                Token.Literal.Numeric.Decimal("1"),
                Token.Punctuation.Comma,
                Token.Identifier.EnumMemberName("@sufix"),
                Token.Punctuation.Comma,
                Token.Identifier.EnumMemberName("other"),
                Token.Punctuation.CloseBrace]);
        });

        it("in interface declaration", async () => {
            const input = `
public interface @interface { }
public interface @IClassName { }
`;
            let tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Modifier.Public,
                Token.Keyword.Definition.Interface,
                Token.Identifier.InterfaceName("@interface"),
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace,
                Token.Keyword.Modifier.Public,
                Token.Keyword.Definition.Interface,
                Token.Identifier.InterfaceName("@IClassName"),
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace]);
        });

        it("in struct declaration", async () => {
            const input = `
public struct @class { }
public struct @StructName { }
`;
            let tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Modifier.Public,
                Token.Keyword.Definition.Struct,
                Token.Identifier.StructName("@class"),
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace,
                Token.Keyword.Modifier.Public,
                Token.Keyword.Definition.Struct,
                Token.Identifier.StructName("@StructName"),
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace]);
        });

        it("in type parameter list", async () => {
            const input = `
public class Foo<@class, Bar> { }
public class Baz<@Bar, T> { }
`;
            let tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Modifier.Public,
                Token.Keyword.Definition.Class,
                Token.Identifier.ClassName("Foo"),
                Token.Punctuation.TypeParameter.Begin,
                Token.Identifier.TypeParameterName("@class"),
                Token.Punctuation.Comma,
                Token.Identifier.TypeParameterName("Bar"),
                Token.Punctuation.TypeParameter.End,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace,
                Token.Keyword.Modifier.Public,
                Token.Keyword.Definition.Class,
                Token.Identifier.ClassName("Baz"),
                Token.Punctuation.TypeParameter.Begin,
                Token.Identifier.TypeParameterName("@Bar"),
                Token.Punctuation.Comma,
                Token.Identifier.TypeParameterName("T"),
                Token.Punctuation.TypeParameter.End,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace]);
        });

        it("in generic constraints", async () => {
            const input = `class S<T1, T2> where T1 : @class { }`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Definition.Class,
                Token.Identifier.ClassName("S"),
                Token.Punctuation.TypeParameter.Begin,
                Token.Identifier.TypeParameterName("T1"),
                Token.Punctuation.Comma,
                Token.Identifier.TypeParameterName("T2"),
                Token.Punctuation.TypeParameter.End,
                Token.Keyword.Modifier.Where,
                Token.Identifier.TypeParameterName("T1"),
                Token.Punctuation.Colon,
                Token.Type("@class"),
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace]);
        });

        it("in field declaration", async () => {
            const input = Input.InClass(`private String @class;`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Modifier.Private,
                Token.Type("String"),
                Token.Identifier.FieldName("@class"),
                Token.Punctuation.Semicolon]);
        });

        it("in property declaration", async () => {
            const input = Input.InClass(`public Boolean @public { get; set; }`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Modifier.Public,
                Token.Type("Boolean"),
                Token.Identifier.PropertyName("@public"),
                Token.Punctuation.OpenBrace,
                Token.Keyword.Definition.Get,
                Token.Punctuation.Semicolon,
                Token.Keyword.Definition.Set,
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace]);
        });

        it("in indexer declaration", async () => {
            const input = Input.InInterface(`string this[string @class] { get; set; }`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.PrimitiveType.String,
                Token.Variable.This,
                Token.Punctuation.OpenBracket,
                Token.PrimitiveType.String,
                Token.Identifier.ParameterName("@class"),
                Token.Punctuation.CloseBracket,
                Token.Punctuation.OpenBrace,
                Token.Keyword.Definition.Get,
                Token.Punctuation.Semicolon,
                Token.Keyword.Definition.Set,
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace]);
        });

        it("in event declaration", async () => {
            const input = Input.InClass(`public event Type @class;`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Modifier.Public,
                Token.Keyword.Definition.Event,
                Token.Type("Type"),
                Token.Identifier.EventName("@class"),
                Token.Punctuation.Semicolon]);
        });

        it("in method declaration", async () => {
            const input = Input.InClass(`public void @void() { }`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Modifier.Public,
                Token.PrimitiveType.Void,
                Token.Identifier.MethodName("@void"),
                Token.Punctuation.OpenParen,
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace
            ]);
        });

        it("in constructor declaration", async () => {
            const input = `
public class @class
{
    public @class() { }
}
`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Modifier.Public,
                Token.Keyword.Definition.Class,
                Token.Identifier.ClassName("@class"),
                Token.Punctuation.OpenBrace,
                Token.Keyword.Modifier.Public,
                Token.Identifier.MethodName("@class"),
                Token.Punctuation.OpenParen,
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace,
                Token.Punctuation.CloseBrace]);
        });

        it("in destructor declaration", async () => {
            const input = Input.InClass(`~@class() { }`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.Tilde,
                Token.Identifier.MethodName("@class"),
                Token.Punctuation.OpenParen,
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace]);
        });

        it("in operator declaration", async () => {
            const input = Input.InClass(`public static @class operator +(int value) { return null; }`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Modifier.Public,
                Token.Keyword.Modifier.Static,
                Token.Type("@class"),
                Token.Keyword.Definition.Operator,
                Token.Identifier.MethodName("+"),
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Int,
                Token.Identifier.ParameterName("value"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Keyword.Flow.Return,
                Token.Literal.Null,
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace]);
        });

        it("in conversion operator declaration", async () => {
            const input = Input.InClass(`public static implicit operator @class(int x) { return null; }`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Modifier.Public,
                Token.Keyword.Modifier.Static,
                Token.Keyword.Modifier.Implicit,
                Token.Keyword.Definition.Operator,
                Token.Type("@class"),
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Int,
                Token.Identifier.ParameterName("x"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Keyword.Flow.Return,
                Token.Literal.Null,
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace]);
        });

        it("in goto statement", async () => {
            const input = Input.InMethod(`
@Make:
    var a = 1;

goto @Make;
`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Identifier.LabelName("@Make"),
                Token.Punctuation.Colon,
                Token.Keyword.Definition.Var,
                Token.Identifier.LocalName("a"),
                Token.Operator.Assignment,
                Token.Literal.Numeric.Decimal("1"),
                Token.Punctuation.Semicolon,
                Token.Keyword.Flow.Goto,
                Token.Identifier.LabelName("@Make"),
                Token.Punctuation.Semicolon]);
        });

        it("in foreach statement", async () => {
            const input = Input.InMethod(`foreach (int @class in @classes) { }`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Loop.ForEach,
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Int,
                Token.Identifier.LocalName("@class"),
                Token.Keyword.Loop.In,
                Token.Variable.ReadWrite("@classes"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace,
            ]);
        });

        it("in catch clause", async () => {
            const input = Input.InMethod(`
try
{
}
catch (@class @ex)
{
}`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Exception.Try,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace,
                Token.Keyword.Exception.Catch,
                Token.Punctuation.OpenParen,
                Token.Type("@class"),
                Token.Identifier.LocalName("@ex"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace
            ]);
        });

        it("in local variable declaration", async () => {
            const input = Input.InMethod(`
var @class = @event.x;`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Definition.Var,
                Token.Identifier.LocalName("@class"),
                Token.Operator.Assignment,
                Token.Variable.Object("@event"),
                Token.Punctuation.Accessor,
                Token.Variable.Property("x"),
                Token.Punctuation.Semicolon
            ]);
        });

        it("in local constant declaration", async () => {
            const input = Input.InMethod(`
const string @class = obj.@class;`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Modifier.Const,
                Token.PrimitiveType.String,
                Token.Identifier.LocalName("@class"),
                Token.Operator.Assignment,
                Token.Variable.Object("obj"),
                Token.Punctuation.Accessor,
                Token.Variable.Property("@class"),
                Token.Punctuation.Semicolon
            ]);
        });

        it("in tuple deconstruction", async () => {
            const input = Input.InMethod(`(int x, string @class) = (@count, "test");`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Int,
                Token.Identifier.TupleElementName("x"),
                Token.Punctuation.Comma,
                Token.PrimitiveType.String,
                Token.Identifier.TupleElementName("@class"),
                Token.Punctuation.CloseParen,
                Token.Operator.Assignment,
                Token.Punctuation.OpenParen,
                Token.Variable.ReadWrite("@count"),
                Token.Punctuation.Comma,
                Token.Punctuation.String.Begin,
                Token.Literal.String("test"),
                Token.Punctuation.String.End,
                Token.Punctuation.CloseParen,
                Token.Punctuation.Semicolon
            ]);
        });

        it("in declaration expression local", async () => {
            const input = Input.InMethod(`M(out int @x, out var @y);`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Identifier.MethodName("M"),
                Token.Punctuation.OpenParen,
                Token.Keyword.Modifier.Out,
                Token.PrimitiveType.Int,
                Token.Identifier.LocalName("@x"),
                Token.Punctuation.Comma,
                Token.Keyword.Modifier.Out,
                Token.Keyword.Definition.Var,
                Token.Identifier.LocalName("@y"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.Semicolon
            ]);
        });

        it("in cast expression", async () => {
            const input = Input.InMethod(`var x = (@class)@variable;`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Definition.Var,
                Token.Identifier.LocalName("x"),
                Token.Operator.Assignment,
                Token.Punctuation.OpenParen,
                Token.Type("@class"),
                Token.Punctuation.CloseParen,
                Token.Variable.ReadWrite("@variable"),
                Token.Punctuation.Semicolon
            ]);
        });

        it("in as expression", async () => {
            const input = Input.InMethod(`var x = @variable as @class;`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Definition.Var,
                Token.Identifier.LocalName("x"),
                Token.Operator.Assignment,
                Token.Variable.ReadWrite("@variable"),
                Token.Operator.Expression.As,
                Token.Type("@class"),
                Token.Punctuation.Semicolon
            ]);
        });

        it("in is expression", async () => {
            const input = Input.InMethod(`var x = @variable is @class;`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Definition.Var,
                Token.Identifier.LocalName("x"),
                Token.Operator.Assignment,
                Token.Variable.ReadWrite("@variable"),
                Token.Operator.Pattern.Is,
                Token.Type("@class"),
                Token.Punctuation.Semicolon
            ]);
        });

        it("in object creation with parameters", async () => {
            const input = Input.InMethod(`var x = new @class(@event, y);`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Definition.Var,
                Token.Identifier.LocalName("x"),
                Token.Operator.Assignment,
                Token.Operator.Expression.New,
                Token.Type("@class"),
                Token.Punctuation.OpenParen,
                Token.Variable.ReadWrite("@event"),
                Token.Punctuation.Comma,
                Token.Variable.ReadWrite("y"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.Semicolon
            ]);
        });

        it("in array creation", async () => {
            const input = Input.InMethod(`@class[] x = new @class[0];`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Type("@class"),
                Token.Punctuation.OpenBracket,
                Token.Punctuation.CloseBracket,
                Token.Identifier.LocalName("x"),
                Token.Operator.Assignment,
                Token.Operator.Expression.New,
                Token.Type("@class"),
                Token.Punctuation.OpenBracket,
                Token.Literal.Numeric.Decimal("0"),
                Token.Punctuation.CloseBracket,
                Token.Punctuation.Semicolon
            ]);
        });

        it("in named arguments", async () => {
            const input = Input.InMethod(`var x = Test(@default = 1);`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Definition.Var,
                Token.Identifier.LocalName("x"),
                Token.Operator.Assignment,
                Token.Identifier.MethodName("Test"),
                Token.Punctuation.OpenParen,
                Token.Variable.ReadWrite("@default"),
                Token.Operator.Assignment,
                Token.Literal.Numeric.Decimal("1"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.Semicolon
            ]);
        });

        it("in query expression", async () => {
            const input = Input.InMethod(`var query = from @class in numbers`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Definition.Var,
                Token.Identifier.LocalName("query"),
                Token.Operator.Assignment,
                Token.Operator.Query.From,
                Token.Identifier.RangeVariableName("@class"),
                Token.Operator.Query.In,
                Token.Variable.ReadWrite("numbers")
            ]);
        });

        it("in let clause", async () => {
            const input = Input.InMethod(`
var earlyBirdQuery =
    from sentence in strings
    let @words = sentence.Split(' ')
    from word in @words
    select word;`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Definition.Var,
                Token.Identifier.LocalName("earlyBirdQuery"),
                Token.Operator.Assignment,
                Token.Operator.Query.From,
                Token.Identifier.RangeVariableName("sentence"),
                Token.Operator.Query.In,
                Token.Variable.ReadWrite("strings"),
                Token.Operator.Query.Let,
                Token.Identifier.RangeVariableName("@words"),
                Token.Operator.Assignment,
                Token.Variable.Object("sentence"),
                Token.Punctuation.Accessor,
                Token.Identifier.MethodName("Split"),
                Token.Punctuation.OpenParen,
                Token.Punctuation.Char.Begin,
                Token.Literal.Char(" "),
                Token.Punctuation.Char.End,
                Token.Punctuation.CloseParen,
                Token.Operator.Query.From,
                Token.Identifier.RangeVariableName("word"),
                Token.Operator.Query.In,
                Token.Variable.ReadWrite("@words"),
                Token.Operator.Query.Select,
                Token.Variable.ReadWrite("word"),
                Token.Punctuation.Semicolon
            ]);
        });

        it("in join clause", async () => {
            const input = Input.InMethod(`
var query =
    from category in categories
    join @prod in products on category.ID equals @prod.CategoryID into prodGroup
    select new { CategoryName = category.Name, Products = prodGroup };`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Definition.Var,
                Token.Identifier.LocalName("query"),
                Token.Operator.Assignment,
                Token.Operator.Query.From,
                Token.Identifier.RangeVariableName("category"),
                Token.Operator.Query.In,
                Token.Variable.ReadWrite("categories"),
                Token.Operator.Query.Join,
                Token.Identifier.RangeVariableName("@prod"),
                Token.Operator.Query.In,
                Token.Variable.ReadWrite("products"),
                Token.Operator.Query.On,
                Token.Variable.Object("category"),
                Token.Punctuation.Accessor,
                Token.Variable.Property("ID"),
                Token.Operator.Query.Equals,
                Token.Variable.Object("@prod"),
                Token.Punctuation.Accessor,
                Token.Variable.Property("CategoryID"),
                Token.Operator.Query.Into,
                Token.Identifier.RangeVariableName("prodGroup"),
                Token.Operator.Query.Select,
                Token.Operator.Expression.New,
                Token.Punctuation.OpenBrace,
                Token.Variable.ReadWrite("CategoryName"),
                Token.Operator.Assignment,
                Token.Variable.Object("category"),
                Token.Punctuation.Accessor,
                Token.Variable.Property("Name"),
                Token.Punctuation.Comma,
                Token.Variable.ReadWrite("Products"),
                Token.Operator.Assignment,
                Token.Variable.ReadWrite("prodGroup"),
                Token.Punctuation.CloseBrace,
                Token.Punctuation.Semicolon
            ]);
        });

        it("in join into", async () => {
            const input = Input.InMethod(`
var query =
    from category in categories
    join prod in products on category.ID equals prod.CategoryID into @prodGroup
    select new { CategoryName = category.Name, Products = @prodGroup };`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Definition.Var,
                Token.Identifier.LocalName("query"),
                Token.Operator.Assignment,
                Token.Operator.Query.From,
                Token.Identifier.RangeVariableName("category"),
                Token.Operator.Query.In,
                Token.Variable.ReadWrite("categories"),
                Token.Operator.Query.Join,
                Token.Identifier.RangeVariableName("prod"),
                Token.Operator.Query.In,
                Token.Variable.ReadWrite("products"),
                Token.Operator.Query.On,
                Token.Variable.Object("category"),
                Token.Punctuation.Accessor,
                Token.Variable.Property("ID"),
                Token.Operator.Query.Equals,
                Token.Variable.Object("prod"),
                Token.Punctuation.Accessor,
                Token.Variable.Property("CategoryID"),
                Token.Operator.Query.Into,
                Token.Identifier.RangeVariableName("@prodGroup"),
                Token.Operator.Query.Select,
                Token.Operator.Expression.New,
                Token.Punctuation.OpenBrace,
                Token.Variable.ReadWrite("CategoryName"),
                Token.Operator.Assignment,
                Token.Variable.Object("category"),
                Token.Punctuation.Accessor,
                Token.Variable.Property("Name"),
                Token.Punctuation.Comma,
                Token.Variable.ReadWrite("Products"),
                Token.Operator.Assignment,
                Token.Variable.ReadWrite("@prodGroup"),
                Token.Punctuation.CloseBrace,
                Token.Punctuation.Semicolon
            ]);
        });

        it("in group into", async () => {
            const input = Input.InMethod(`
var results =
    from p in people
    group p.Car by p.PersonId into @group
    select new { PersonId = @group.Key, Cars = @group };`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Definition.Var,
                Token.Identifier.LocalName("results"),
                Token.Operator.Assignment,
                Token.Operator.Query.From,
                Token.Identifier.RangeVariableName("p"),
                Token.Operator.Query.In,
                Token.Variable.ReadWrite("people"),
                Token.Operator.Query.Group,
                Token.Variable.Object("p"),
                Token.Punctuation.Accessor,
                Token.Variable.Property("Car"),
                Token.Operator.Query.By,
                Token.Variable.Object("p"),
                Token.Punctuation.Accessor,
                Token.Variable.Property("PersonId"),
                Token.Operator.Query.Into,
                Token.Identifier.RangeVariableName("@group"),
                Token.Operator.Query.Select,
                Token.Operator.Expression.New,
                Token.Punctuation.OpenBrace,
                Token.Variable.ReadWrite("PersonId"),
                Token.Operator.Assignment,
                Token.Variable.Object("@group"),
                Token.Punctuation.Accessor,
                Token.Variable.Property("Key"),
                Token.Punctuation.Comma,
                Token.Variable.ReadWrite("Cars"),
                Token.Operator.Assignment,
                Token.Variable.ReadWrite("@group"),
                Token.Punctuation.CloseBrace,
                Token.Punctuation.Semicolon
            ]);
        });

        it("in lambda parameters", async () => {
            const input = Input.InMethod(`Action<int, int> a = (@x, y) => { };`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Type("Action"),
                Token.Punctuation.TypeParameter.Begin,
                Token.PrimitiveType.Int,
                Token.Punctuation.Comma,
                Token.PrimitiveType.Int,
                Token.Punctuation.TypeParameter.End,
                Token.Identifier.LocalName("a"),
                Token.Operator.Assignment,
                Token.Punctuation.OpenParen,
                Token.Identifier.ParameterName("@x"),
                Token.Punctuation.Comma,
                Token.Identifier.ParameterName("y"),
                Token.Punctuation.CloseParen,
                Token.Operator.Arrow,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace,
                Token.Punctuation.Semicolon
            ]);
        });

        it("in tuple element", async () => {
            const input = Input.InMethod(`(int @x, int y) p = point;`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Int,
                Token.Identifier.TupleElementName("@x"),
                Token.Punctuation.Comma,
                Token.PrimitiveType.Int,
                Token.Identifier.TupleElementName("y"),
                Token.Punctuation.CloseParen,
                Token.Identifier.LocalName("p"),
                Token.Operator.Assignment,
                Token.Variable.ReadWrite("point"),
                Token.Punctuation.Semicolon
            ]);
        });

        it("in anonymous method expression", async () => {
            const input = Input.InMethod(`Action<int> a = @x => { };`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Type("Action"),
                Token.Punctuation.TypeParameter.Begin,
                Token.PrimitiveType.Int,
                Token.Punctuation.TypeParameter.End,
                Token.Identifier.LocalName("a"),
                Token.Operator.Assignment,
                Token.Identifier.ParameterName("@x"),
                Token.Operator.Arrow,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace,
                Token.Punctuation.Semicolon
            ]);
        });
    });
});

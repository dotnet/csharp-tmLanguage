/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { should } from 'chai';
import { tokenize, Input, Token } from './utils/tokenize';

describe("Grammar", () => {
    before(() => { should() });

    describe("Verbatim identifier", () => {
        it("in extern alias directive", () => {
            const input = `
extern alias @foo;
extern alias @class;
extern alias @namespace;
`;

            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Extern,
                Token.Keywords.Alias,
                Token.Variables.Alias("@foo"),
                Token.Punctuation.Semicolon,
                Token.Keywords.Extern,
                Token.Keywords.Alias,
                Token.Variables.Alias("@class"),
                Token.Punctuation.Semicolon,
                Token.Keywords.Extern,
                Token.Keywords.Alias,
                Token.Variables.Alias("@namespace"),
                Token.Punctuation.Semicolon]);
        });

        it("in using directive", () => {
            const input = `
using @if;
using @class;
using @Foo.Bar;
using@Foo.Baz;
`;

            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Using,
                Token.Identifiers.NamespaceName("@if"),
                Token.Punctuation.Semicolon,
                Token.Keywords.Using,
                Token.Identifiers.NamespaceName("@class"),
                Token.Punctuation.Semicolon,
                Token.Keywords.Using,
                Token.Identifiers.NamespaceName("@Foo"),
                Token.Identifiers.NamespaceName("Bar"),
                Token.Punctuation.Semicolon,
                Token.Keywords.Using,
                Token.Identifiers.NamespaceName("@Foo"),
                Token.Identifiers.NamespaceName("Baz"),
                Token.Punctuation.Semicolon]);
        });

        it("in attribute's named argument", () => {
            const input = `[Foo(@class = 1)]`;
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.OpenBracket,
                Token.Type("Foo"),
                Token.Punctuation.OpenParen,
                Token.Identifiers.PropertyName("@class"),
                Token.Operators.Assignment,
                Token.Literals.Numeric.Decimal("1"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.CloseBracket]);
        });

        it("in namespace directive", () => {
            const input = `
namespace @class
{
}
`;
            let tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Namespace,
                Token.Identifiers.NamespaceName("@class"),
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace]);
        });

        it("in class declaration", () => {
            const input = `
public class @class { }
public class @ClassName { }
`;
            let tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Public,
                Token.Keywords.Class,
                Token.Identifiers.ClassName("@class"),
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace,
                Token.Keywords.Modifiers.Public,
                Token.Keywords.Class,
                Token.Identifiers.ClassName("@ClassName"),
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace]);
        });

        it("in delegate declaration", () => {
            const input = `delegate void @class();`;
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Delegate,
                Token.PrimitiveType.Void,
                Token.Identifiers.DelegateName("@class"),
                Token.Punctuation.OpenParen,
                Token.Punctuation.CloseParen,
                Token.Punctuation.Semicolon]);
        });

        it("in enum declaration", () => {
            const input = `enum @class { }`;
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Enum,
                Token.Identifiers.EnumName("@class"),
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace]);
        });

        it("in enum member", () => {
            const input = `
enum E
{
    @class = 1,
    @sufix,
    other
}
`;
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Enum,
                Token.Identifiers.EnumName("E"),
                Token.Punctuation.OpenBrace,
                Token.Identifiers.EnumMemberName("@class"),
                Token.Operators.Assignment,
                Token.Literals.Numeric.Decimal("1"),
                Token.Punctuation.Comma,
                Token.Identifiers.EnumMemberName("@sufix"),
                Token.Punctuation.Comma,
                Token.Identifiers.EnumMemberName("other"),
                Token.Punctuation.CloseBrace]);
        });

        it("in interface declaration", () => {
            const input = `
public interface @interface { }
public interface @IClassName { }
`;
            let tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Public,
                Token.Keywords.Interface,
                Token.Identifiers.InterfaceName("@interface"),
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace,
                Token.Keywords.Modifiers.Public,
                Token.Keywords.Interface,
                Token.Identifiers.InterfaceName("@IClassName"),
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace]);
        });

        it("in struct declaration", () => {
            const input = `
public struct @class { }
public struct @StructName { }
`;
            let tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Public,
                Token.Keywords.Struct,
                Token.Identifiers.StructName("@class"),
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace,
                Token.Keywords.Modifiers.Public,
                Token.Keywords.Struct,
                Token.Identifiers.StructName("@StructName"),
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace]);
        });

        it("in type parameter list", () => {
            const input = `
public class Foo<@class, Bar> { }
public class Baz<@Bar, T> { }
`;
            let tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Public,
                Token.Keywords.Class,
                Token.Identifiers.ClassName("Foo"),
                Token.Punctuation.TypeParameters.Begin,
                Token.Identifiers.TypeParameterName("@class"),
                Token.Punctuation.Comma,
                Token.Identifiers.TypeParameterName("Bar"),
                Token.Punctuation.TypeParameters.End,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace,
                Token.Keywords.Modifiers.Public,
                Token.Keywords.Class,
                Token.Identifiers.ClassName("Baz"),
                Token.Punctuation.TypeParameters.Begin,
                Token.Identifiers.TypeParameterName("@Bar"),
                Token.Punctuation.Comma,
                Token.Identifiers.TypeParameterName("T"),
                Token.Punctuation.TypeParameters.End,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace]);
        });

        it("in generic constraints", () => {
            const input = `class S<T1, T2> where T1 : @class { }`;
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Class,
                Token.Identifiers.ClassName("S"),
                Token.Punctuation.TypeParameters.Begin,
                Token.Identifiers.TypeParameterName("T1"),
                Token.Punctuation.Comma,
                Token.Identifiers.TypeParameterName("T2"),
                Token.Punctuation.TypeParameters.End,
                Token.Keywords.Where,
                Token.Type("T1"),
                Token.Punctuation.Colon,
                Token.Type("@class"),
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace]);
        });

        it("in field declaration", () => {
            const input = Input.InClass(`private String @class;`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Private,
                Token.Type("String"),
                Token.Identifiers.FieldName("@class"),
                Token.Punctuation.Semicolon]);
        });

        it("in property declaration", () => {
            const input = Input.InClass(`public Boolean @public { get; set; }`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Public,
                Token.Type("Boolean"),
                Token.Identifiers.PropertyName("@public"),
                Token.Punctuation.OpenBrace,
                Token.Keywords.Get,
                Token.Punctuation.Semicolon,
                Token.Keywords.Set,
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace]);
        });

        it("in indexer declaration", () => {
            const input = Input.InInterface(`string this[string @class] { get; set; }`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.PrimitiveType.String,
                Token.Keywords.This,
                Token.Punctuation.OpenBracket,
                Token.PrimitiveType.String,
                Token.Identifiers.ParameterName("@class"),
                Token.Punctuation.CloseBracket,
                Token.Punctuation.OpenBrace,
                Token.Keywords.Get,
                Token.Punctuation.Semicolon,
                Token.Keywords.Set,
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace]);
        });

        it("in event declaration", () => {
            const input = Input.InClass(`public event Type @class;`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Public,
                Token.Keywords.Event,
                Token.Type("Type"),
                Token.Identifiers.EventName("@class"),
                Token.Punctuation.Semicolon]);
        });

        it("in method declaration", () => {
            const input = Input.InClass(`public void @void() { }`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Public,
                Token.PrimitiveType.Void,
                Token.Identifiers.MethodName("@void"),
                Token.Punctuation.OpenParen,
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace
            ]);
        });

        it("in constructor declaration", () => {
            const input = `
public class @class
{
    public @class() { }
}
`;
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Public,
                Token.Keywords.Class,
                Token.Identifiers.ClassName("@class"),
                Token.Punctuation.OpenBrace,
                Token.Keywords.Modifiers.Public,
                Token.Identifiers.MethodName("@class"),
                Token.Punctuation.OpenParen,
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace,
                Token.Punctuation.CloseBrace]);
        });

        it("in destructor declaration", () => {
            const input = Input.InClass(`~@class() { }`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.Tilde,
                Token.Identifiers.MethodName("@class"),
                Token.Punctuation.OpenParen,
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace]);
        });

        it("in operator declaration", () => {
            const input = Input.InClass(`public static @class operator +(int value) { return null; }`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Public,
                Token.Keywords.Modifiers.Static,
                Token.Type("@class"),
                Token.Keywords.Operator,
                Token.Identifiers.MethodName("+"),
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Int,
                Token.Identifiers.ParameterName("value"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Keywords.Control.Return,
                Token.Literals.Null,
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace]);
        });

        it("in conversion operator declaration", () => {
            const input = Input.InClass(`public static implicit operator @class(int x) { return null; }`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Public,
                Token.Keywords.Modifiers.Static,
                Token.Keywords.Implicit,
                Token.Keywords.Operator,
                Token.Type("@class"),
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Int,
                Token.Identifiers.ParameterName("x"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Keywords.Control.Return,
                Token.Literals.Null,
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace]);
        });

        it("in goto statement", () => {
            const input = Input.InMethod(`
@Make:
    var a = 1;

goto @Make;
`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Identifiers.LabelName("@Make"),
                Token.Punctuation.Colon,
                Token.Keywords.Var,
                Token.Identifiers.LocalName("a"),
                Token.Operators.Assignment,
                Token.Literals.Numeric.Decimal("1"),
                Token.Punctuation.Semicolon,
                Token.Keywords.Control.Goto,
                Token.Identifiers.LabelName("@Make"),
                Token.Punctuation.Semicolon]);
        });

        it("in foreach statement", () => {
            const input = Input.InMethod(`foreach (int @class in @classes) { }`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Control.ForEach,
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Int,
                Token.Identifiers.LocalName("@class"),
                Token.Keywords.Control.In,
                Token.Variables.ReadWrite("@classes"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace,
            ]);
        });

        it("in catch clause", () => {
            const input = Input.InMethod(`
try
{
}
catch (@class @ex)
{
}`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Control.Try,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace,
                Token.Keywords.Control.Catch,
                Token.Punctuation.OpenParen,
                Token.Type("@class"),
                Token.Identifiers.LocalName("@ex"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace
            ]);
        });

        it("in local variable declaration", () => {
            const input = Input.InMethod(`
var @class = @event.x;`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Var,
                Token.Identifiers.LocalName("@class"),
                Token.Operators.Assignment,
                Token.Variables.Object("@event"),
                Token.Punctuation.Accessor,
                Token.Variables.Property("x"),
                Token.Punctuation.Semicolon
            ]);
        });

        it("in local constant declaration", () => {
            const input = Input.InMethod(`
const string @class = obj.@class;`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Const,
                Token.PrimitiveType.String,
                Token.Identifiers.LocalName("@class"),
                Token.Operators.Assignment,
                Token.Variables.Object("obj"),
                Token.Punctuation.Accessor,
                Token.Variables.Property("@class"),
                Token.Punctuation.Semicolon
            ]);
        });

        it("in tuple deconstruction", () => {
            const input = Input.InMethod(`(int x, string @class) = (@count, "test");`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Int,
                Token.Identifiers.TupleElementName("x"),
                Token.Punctuation.Comma,
                Token.PrimitiveType.String,
                Token.Identifiers.TupleElementName("@class"),
                Token.Punctuation.CloseParen,
                Token.Operators.Assignment,
                Token.Punctuation.OpenParen,
                Token.Variables.ReadWrite("@count"),
                Token.Punctuation.Comma,
                Token.Punctuation.String.Begin,
                Token.Literals.String("test"),
                Token.Punctuation.String.End,
                Token.Punctuation.CloseParen,
                Token.Punctuation.Semicolon
            ]);
        });

        it("in declaration expression local", () => {
            const input = Input.InMethod(`M(out int @x, out var @y);`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Identifiers.MethodName("M"),
                Token.Punctuation.OpenParen,
                Token.Keywords.Modifiers.Out,
                Token.PrimitiveType.Int,
                Token.Identifiers.LocalName("@x"),
                Token.Punctuation.Comma,
                Token.Keywords.Modifiers.Out,
                Token.Keywords.Var,
                Token.Identifiers.LocalName("@y"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.Semicolon
            ]);
        });

        it("in cast expression", () => {
            const input = Input.InMethod(`var x = (@class)@variable;`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Var,
                Token.Identifiers.LocalName("x"),
                Token.Operators.Assignment,
                Token.Punctuation.OpenParen,
                Token.Type("@class"),
                Token.Punctuation.CloseParen,
                Token.Variables.ReadWrite("@variable"),
                Token.Punctuation.Semicolon
            ]);
        });

        it("in as expression", () => {
            const input = Input.InMethod(`var x = @variable as @class;`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Var,
                Token.Identifiers.LocalName("x"),
                Token.Operators.Assignment,
                Token.Variables.ReadWrite("@variable"),
                Token.Keywords.As,
                Token.Type("@class"),
                Token.Punctuation.Semicolon
            ]);
        });

        it("in is expression", () => {
            const input = Input.InMethod(`var x = @variable is @class;`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Var,
                Token.Identifiers.LocalName("x"),
                Token.Operators.Assignment,
                Token.Variables.ReadWrite("@variable"),
                Token.Keywords.Is,
                Token.Type("@class"),
                Token.Punctuation.Semicolon
            ]);
        });

        it("in object creation with parameters", () => {
            const input = Input.InMethod(`var x = new @class(@event, y);`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Var,
                Token.Identifiers.LocalName("x"),
                Token.Operators.Assignment,
                Token.Keywords.New,
                Token.Type("@class"),
                Token.Punctuation.OpenParen,
                Token.Variables.ReadWrite("@event"),
                Token.Punctuation.Comma,
                Token.Variables.ReadWrite("y"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.Semicolon
            ]);
        });

        it("in array creation", () => {
            const input = Input.InMethod(`@class[] x = new @class[0];`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Type("@class"),
                Token.Punctuation.OpenBracket,
                Token.Punctuation.CloseBracket,
                Token.Identifiers.LocalName("x"),
                Token.Operators.Assignment,
                Token.Keywords.New,
                Token.Type("@class"),
                Token.Punctuation.OpenBracket,
                Token.Literals.Numeric.Decimal("0"),
                Token.Punctuation.CloseBracket,
                Token.Punctuation.Semicolon
            ]);
        });

        it("in named arguments", () => {
            const input = Input.InMethod(`var x = Test(@default = 1);`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Var,
                Token.Identifiers.LocalName("x"),
                Token.Operators.Assignment,
                Token.Identifiers.MethodName("Test"),
                Token.Punctuation.OpenParen,
                Token.Variables.ReadWrite("@default"),
                Token.Operators.Assignment,
                Token.Literals.Numeric.Decimal("1"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.Semicolon
            ]);
        });

        it("in query expression", () => {
            const input = Input.InMethod(`var query = from @class in numbers`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Var,
                Token.Identifiers.LocalName("query"),
                Token.Operators.Assignment,
                Token.Keywords.Queries.From,
                Token.Identifiers.RangeVariableName("@class"),
                Token.Keywords.Queries.In,
                Token.Variables.ReadWrite("numbers")
            ]);
        });

        it("in let clause", () => {
            const input = Input.InMethod(`
var earlyBirdQuery =
    from sentence in strings
    let @words = sentence.Split(' ')
    from word in @words
    select word;`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Var,
                Token.Identifiers.LocalName("earlyBirdQuery"),
                Token.Operators.Assignment,
                Token.Keywords.Queries.From,
                Token.Identifiers.RangeVariableName("sentence"),
                Token.Keywords.Queries.In,
                Token.Variables.ReadWrite("strings"),
                Token.Keywords.Queries.Let,
                Token.Identifiers.RangeVariableName("@words"),
                Token.Operators.Assignment,
                Token.Variables.Object("sentence"),
                Token.Punctuation.Accessor,
                Token.Identifiers.MethodName("Split"),
                Token.Punctuation.OpenParen,
                Token.Punctuation.Char.Begin,
                Token.Literals.Char(" "),
                Token.Punctuation.Char.End,
                Token.Punctuation.CloseParen,
                Token.Keywords.Queries.From,
                Token.Identifiers.RangeVariableName("word"),
                Token.Keywords.Queries.In,
                Token.Variables.ReadWrite("@words"),
                Token.Keywords.Queries.Select,
                Token.Variables.ReadWrite("word"),
                Token.Punctuation.Semicolon
            ]);
        });

        it("in join clause", () => {
            const input = Input.InMethod(`
var query =
    from category in categories
    join @prod in products on category.ID equals @prod.CategoryID into prodGroup
    select new { CategoryName = category.Name, Products = prodGroup };`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Var,
                Token.Identifiers.LocalName("query"),
                Token.Operators.Assignment,
                Token.Keywords.Queries.From,
                Token.Identifiers.RangeVariableName("category"),
                Token.Keywords.Queries.In,
                Token.Variables.ReadWrite("categories"),
                Token.Keywords.Queries.Join,
                Token.Identifiers.RangeVariableName("@prod"),
                Token.Keywords.Queries.In,
                Token.Variables.ReadWrite("products"),
                Token.Keywords.Queries.On,
                Token.Variables.Object("category"),
                Token.Punctuation.Accessor,
                Token.Variables.Property("ID"),
                Token.Keywords.Queries.Equals,
                Token.Variables.Object("@prod"),
                Token.Punctuation.Accessor,
                Token.Variables.Property("CategoryID"),
                Token.Keywords.Queries.Into,
                Token.Identifiers.RangeVariableName("prodGroup"),
                Token.Keywords.Queries.Select,
                Token.Keywords.New,
                Token.Punctuation.OpenBrace,
                Token.Variables.ReadWrite("CategoryName"),
                Token.Operators.Assignment,
                Token.Variables.Object("category"),
                Token.Punctuation.Accessor,
                Token.Variables.Property("Name"),
                Token.Punctuation.Comma,
                Token.Variables.ReadWrite("Products"),
                Token.Operators.Assignment,
                Token.Variables.ReadWrite("prodGroup"),
                Token.Punctuation.CloseBrace,
                Token.Punctuation.Semicolon
            ]);
        });

        it("in join into", () => {
            const input = Input.InMethod(`
var query =
    from category in categories
    join prod in products on category.ID equals prod.CategoryID into @prodGroup
    select new { CategoryName = category.Name, Products = @prodGroup };`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Var,
                Token.Identifiers.LocalName("query"),
                Token.Operators.Assignment,
                Token.Keywords.Queries.From,
                Token.Identifiers.RangeVariableName("category"),
                Token.Keywords.Queries.In,
                Token.Variables.ReadWrite("categories"),
                Token.Keywords.Queries.Join,
                Token.Identifiers.RangeVariableName("prod"),
                Token.Keywords.Queries.In,
                Token.Variables.ReadWrite("products"),
                Token.Keywords.Queries.On,
                Token.Variables.Object("category"),
                Token.Punctuation.Accessor,
                Token.Variables.Property("ID"),
                Token.Keywords.Queries.Equals,
                Token.Variables.Object("prod"),
                Token.Punctuation.Accessor,
                Token.Variables.Property("CategoryID"),
                Token.Keywords.Queries.Into,
                Token.Identifiers.RangeVariableName("@prodGroup"),
                Token.Keywords.Queries.Select,
                Token.Keywords.New,
                Token.Punctuation.OpenBrace,
                Token.Variables.ReadWrite("CategoryName"),
                Token.Operators.Assignment,
                Token.Variables.Object("category"),
                Token.Punctuation.Accessor,
                Token.Variables.Property("Name"),
                Token.Punctuation.Comma,
                Token.Variables.ReadWrite("Products"),
                Token.Operators.Assignment,
                Token.Variables.ReadWrite("@prodGroup"),
                Token.Punctuation.CloseBrace,
                Token.Punctuation.Semicolon
            ]);
        });

        it("in group into", () => {
            const input = Input.InMethod(`
var results =
    from p in people
    group p.Car by p.PersonId into @group
    select new { PersonId = @group.Key, Cars = @group };`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Var,
                Token.Identifiers.LocalName("results"),
                Token.Operators.Assignment,
                Token.Keywords.Queries.From,
                Token.Identifiers.RangeVariableName("p"),
                Token.Keywords.Queries.In,
                Token.Variables.ReadWrite("people"),
                Token.Keywords.Queries.Group,
                Token.Variables.Object("p"),
                Token.Punctuation.Accessor,
                Token.Variables.Property("Car"),
                Token.Keywords.Queries.By,
                Token.Variables.Object("p"),
                Token.Punctuation.Accessor,
                Token.Variables.Property("PersonId"),
                Token.Keywords.Queries.Into,
                Token.Identifiers.RangeVariableName("@group"),
                Token.Keywords.Queries.Select,
                Token.Keywords.New,
                Token.Punctuation.OpenBrace,
                Token.Variables.ReadWrite("PersonId"),
                Token.Operators.Assignment,
                Token.Variables.Object("@group"),
                Token.Punctuation.Accessor,
                Token.Variables.Property("Key"),
                Token.Punctuation.Comma,
                Token.Variables.ReadWrite("Cars"),
                Token.Operators.Assignment,
                Token.Variables.ReadWrite("@group"),
                Token.Punctuation.CloseBrace,
                Token.Punctuation.Semicolon
            ]);
        });

        it("in lambda parameters", () => {
            const input = Input.InMethod(`Action<int, int> a = (@x, y) => { };`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Type("Action"),
                Token.Punctuation.TypeParameters.Begin,
                Token.PrimitiveType.Int,
                Token.Punctuation.Comma,
                Token.PrimitiveType.Int,
                Token.Punctuation.TypeParameters.End,
                Token.Identifiers.LocalName("a"),
                Token.Operators.Assignment,
                Token.Punctuation.OpenParen,
                Token.Identifiers.ParameterName("@x"),
                Token.Punctuation.Comma,
                Token.Identifiers.ParameterName("y"),
                Token.Punctuation.CloseParen,
                Token.Operators.Arrow,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace,
                Token.Punctuation.Semicolon
            ]);
        });

        it("in tuple element", () => {
            const input = Input.InMethod(`(int @x, int y) p = point;`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Int,
                Token.Identifiers.TupleElementName("@x"),
                Token.Punctuation.Comma,
                Token.PrimitiveType.Int,
                Token.Identifiers.TupleElementName("y"),
                Token.Punctuation.CloseParen,
                Token.Identifiers.LocalName("p"),
                Token.Operators.Assignment,
                Token.Variables.ReadWrite("point"),
                Token.Punctuation.Semicolon
            ]);
        });

        it("in anonymous method expression", () => {
            const input = Input.InMethod(`Action<int> a = @x => { };`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Type("Action"),
                Token.Punctuation.TypeParameters.Begin,
                Token.PrimitiveType.Int,
                Token.Punctuation.TypeParameters.End,
                Token.Identifiers.LocalName("a"),
                Token.Operators.Assignment,
                Token.Identifiers.ParameterName("@x"),
                Token.Operators.Arrow,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace,
                Token.Punctuation.Semicolon
            ]);
        });
    });
});
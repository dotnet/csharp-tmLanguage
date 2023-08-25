/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { should } from 'chai';
import { tokenize, Input, Token } from './utils/tokenize';

describe("Constructors", () => {
    before(() => { should(); });

    describe("Constructors", () => {
        it("instance constructor with no parameters", async () => {
            const input = Input.InClass(`TestClass() { }`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Identifiers.MethodName("TestClass"),
                Token.Punctuation.OpenParen,
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace]);
        });

        it("public instance constructor with no parameters", async () => {
            const input = Input.InClass(`public TestClass() { }`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Modifier.Public,
                Token.Identifiers.MethodName("TestClass"),
                Token.Punctuation.OpenParen,
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace]);
        });

        it("public instance constructor with one parameter", async () => {
            const input = Input.InClass(`public TestClass(int x) { }`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Modifier.Public,
                Token.Identifiers.MethodName("TestClass"),
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Int,
                Token.Identifiers.ParameterName("x"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace]);
        });

        it("public instance constructor with one ref parameter", async () => {
            const input = Input.InClass(`public TestClass(ref int x) { }`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Modifier.Public,
                Token.Identifiers.MethodName("TestClass"),
                Token.Punctuation.OpenParen,
                Token.Keyword.Modifier.Ref,
                Token.PrimitiveType.Int,
                Token.Identifiers.ParameterName("x"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace]);
        });

        it("instance constructor with two parameters", async () => {
            const input = Input.InClass(`
TestClass(int x, int y)
{
}`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Identifiers.MethodName("TestClass"),
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Int,
                Token.Identifiers.ParameterName("x"),
                Token.Punctuation.Comma,
                Token.PrimitiveType.Int,
                Token.Identifiers.ParameterName("y"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace]);
        });

        it("instance constructor with expression body", async () => {
            const input = Input.InClass(`TestClass(int x, int y) => Foo();`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Identifiers.MethodName("TestClass"),
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Int,
                Token.Identifiers.ParameterName("x"),
                Token.Punctuation.Comma,
                Token.PrimitiveType.Int,
                Token.Identifiers.ParameterName("y"),
                Token.Punctuation.CloseParen,
                Token.Operators.Arrow,
                Token.Identifiers.MethodName("Foo"),
                Token.Punctuation.OpenParen,
                Token.Punctuation.CloseParen,
                Token.Punctuation.Semicolon]);
        });

        it("static constructor no parameters", async () => {
            const input = Input.InClass(`TestClass() { }`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Identifiers.MethodName("TestClass"),
                Token.Punctuation.OpenParen,
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace]);
        });

        it("instance constructor with 'this' initializer", async () => {
            const input = Input.InClass(`TestClass() : this(42) { }`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Identifiers.MethodName("TestClass"),
                Token.Punctuation.OpenParen,
                Token.Punctuation.CloseParen,
                Token.Punctuation.Colon,
                Token.Variables.This,
                Token.Punctuation.OpenParen,
                Token.Literals.Numeric.Decimal("42"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace]);
        });

        it("public instance constructor with 'this' initializer", async () => {
            const input = Input.InClass(`public TestClass() : this(42) { }`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Modifier.Public,
                Token.Identifiers.MethodName("TestClass"),
                Token.Punctuation.OpenParen,
                Token.Punctuation.CloseParen,
                Token.Punctuation.Colon,
                Token.Variables.This,
                Token.Punctuation.OpenParen,
                Token.Literals.Numeric.Decimal("42"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace]);
        });

        it("instance constructor with 'this' initializer with ref parameter", async () => {
            const input = Input.InClass(`TestClass(int x) : this(ref x) { }`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Identifiers.MethodName("TestClass"),
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Int,
                Token.Identifiers.ParameterName("x"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.Colon,
                Token.Variables.This,
                Token.Punctuation.OpenParen,
                Token.Keyword.Modifier.Ref,
                Token.Variables.ReadWrite("x"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace]);
        });

        it("instance constructor with 'this' initializer with named parameter", async () => {
            const input = Input.InClass(`TestClass(int x) : this(y: x) { }`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Identifiers.MethodName("TestClass"),
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Int,
                Token.Identifiers.ParameterName("x"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.Colon,
                Token.Variables.This,
                Token.Punctuation.OpenParen,
                Token.Identifiers.ParameterName("y"),
                Token.Punctuation.Colon,
                Token.Variables.ReadWrite("x"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace]);
        });

        it("instance constructor with 'base' initializer", async () => {
            const input = Input.InClass(`TestClass() : base(42) { }`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Identifiers.MethodName("TestClass"),
                Token.Punctuation.OpenParen,
                Token.Punctuation.CloseParen,
                Token.Punctuation.Colon,
                Token.Variables.Base,
                Token.Punctuation.OpenParen,
                Token.Literals.Numeric.Decimal("42"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace]);
        });

        it("instance constructor with 'base' initializer on separate line", async () => {
            const input = Input.InClass(`
TestClass() :
    base(42)
{
}`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Identifiers.MethodName("TestClass"),
                Token.Punctuation.OpenParen,
                Token.Punctuation.CloseParen,
                Token.Punctuation.Colon,
                Token.Variables.Base,
                Token.Punctuation.OpenParen,
                Token.Literals.Numeric.Decimal("42"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace]);
        });

        it("Open multiline comment in front of parameter highlights properly (issue omnisharp-vscode#861)", async () => {
            const input = Input.InClass(`
internal WaitHandle(Task self, TT.Task /*task)
{
    this.task = task;
    this.selff = self;
}
`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Modifier.Internal,
                Token.Identifiers.MethodName("WaitHandle"),
                Token.Punctuation.OpenParen,
                Token.Type("Task"),
                Token.Identifiers.ParameterName("self"),
                Token.Punctuation.Comma,
                Token.Comment.MultiLine.Start,
                Token.Comment.MultiLine.Text("task)"),
                Token.Comment.MultiLine.Text("{"),
                Token.Comment.MultiLine.Text("    this.task = task;"),
                Token.Comment.MultiLine.Text("    this.selff = self;"),
                Token.Comment.MultiLine.Text("}"),
                Token.Comment.MultiLine.Text("")
            ]);
        });

        it("Highlight properly within base constructor initializer (issue omnisharp-vscode#782)", async () => {
            const input = `
public class A
{
    public A() : base(
            1,
            "abc"
            new B<char>(),
            new B<string>()) {
        var a = 1;
        var b = "abc";
        var c = new B<char>();
        var c = new B<string>();
    }
}
`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Modifier.Public,
                Token.Keyword.Definition.Class,
                Token.Identifiers.ClassName("A"),
                Token.Punctuation.OpenBrace,
                Token.Keyword.Modifier.Public,
                Token.Identifiers.MethodName("A"),
                Token.Punctuation.OpenParen,
                Token.Punctuation.CloseParen,
                Token.Punctuation.Colon,
                Token.Variables.Base,
                Token.Punctuation.OpenParen,
                Token.Literals.Numeric.Decimal("1"),
                Token.Punctuation.Comma,
                Token.Punctuation.String.Begin,
                Token.Literals.String("abc"),
                Token.Punctuation.String.End,
                Token.Operators.Expression.New,
                Token.Type("B"),
                Token.Punctuation.TypeParameters.Begin,
                Token.PrimitiveType.Char,
                Token.Punctuation.TypeParameters.End,
                Token.Punctuation.OpenParen,
                Token.Punctuation.CloseParen,
                Token.Punctuation.Comma,
                Token.Operators.Expression.New,
                Token.Type("B"),
                Token.Punctuation.TypeParameters.Begin,
                Token.PrimitiveType.String,
                Token.Punctuation.TypeParameters.End,
                Token.Punctuation.OpenParen,
                Token.Punctuation.CloseParen,
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Keyword.Definition.Var,
                Token.Identifiers.LocalName("a"),
                Token.Operators.Assignment,
                Token.Literals.Numeric.Decimal("1"),
                Token.Punctuation.Semicolon,
                Token.Keyword.Definition.Var,
                Token.Identifiers.LocalName("b"),
                Token.Operators.Assignment,
                Token.Punctuation.String.Begin,
                Token.Literals.String("abc"),
                Token.Punctuation.String.End,
                Token.Punctuation.Semicolon,
                Token.Keyword.Definition.Var,
                Token.Identifiers.LocalName("c"),
                Token.Operators.Assignment,
                Token.Operators.Expression.New,
                Token.Type("B"),
                Token.Punctuation.TypeParameters.Begin,
                Token.PrimitiveType.Char,
                Token.Punctuation.TypeParameters.End,
                Token.Punctuation.OpenParen,
                Token.Punctuation.CloseParen,
                Token.Punctuation.Semicolon,
                Token.Keyword.Definition.Var,
                Token.Identifiers.LocalName("c"),
                Token.Operators.Assignment,
                Token.Operators.Expression.New,
                Token.Type("B"),
                Token.Punctuation.TypeParameters.Begin,
                Token.PrimitiveType.String,
                Token.Punctuation.TypeParameters.End,
                Token.Punctuation.OpenParen,
                Token.Punctuation.CloseParen,
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace,
                Token.Punctuation.CloseBrace
            ]);
        });

        it("closing parenthesis of parameter list on next line", async () => {
            const input = Input.InClass(`
public C(
    string s
    )
{
}`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Modifier.Public,
                Token.Identifiers.MethodName("C"),
                Token.Punctuation.OpenParen,

                Token.PrimitiveType.String,
                Token.Identifiers.ParameterName("s"),

                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace
            ]);
        });

        it("closing parenthesis of parameter list on next line (issue #88)", async () => {
            const input = Input.InClass(`
public AccountController(
    UserManager<User> userManager,
    SignInManager<User> signInManager,
    ILogger<AccountController> logger
    )
{
}`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Modifier.Public,
                Token.Identifiers.MethodName("AccountController"),
                Token.Punctuation.OpenParen,

                Token.Type("UserManager"),
                Token.Punctuation.TypeParameters.Begin,
                Token.Type("User"),
                Token.Punctuation.TypeParameters.End,
                Token.Identifiers.ParameterName("userManager"),
                Token.Punctuation.Comma,

                Token.Type("SignInManager"),
                Token.Punctuation.TypeParameters.Begin,
                Token.Type("User"),
                Token.Punctuation.TypeParameters.End,
                Token.Identifiers.ParameterName("signInManager"),
                Token.Punctuation.Comma,

                Token.Type("ILogger"),
                Token.Punctuation.TypeParameters.Begin,
                Token.Type("AccountController"),
                Token.Punctuation.TypeParameters.End,
                Token.Identifiers.ParameterName("logger"),

                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace
            ]);
        });
    });
});
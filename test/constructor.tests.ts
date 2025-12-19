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
                Token.Identifier.MethodName("TestClass"),
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
                Token.Identifier.MethodName("TestClass"),
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
                Token.Identifier.MethodName("TestClass"),
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Int,
                Token.Identifier.ParameterName("x"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace]);
        });

        it("public instance constructor with one ref parameter", async () => {
            const input = Input.InClass(`public TestClass(ref int x) { }`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Modifier.Public,
                Token.Identifier.MethodName("TestClass"),
                Token.Punctuation.OpenParen,
                Token.Keyword.Modifier.Ref,
                Token.PrimitiveType.Int,
                Token.Identifier.ParameterName("x"),
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
                Token.Identifier.MethodName("TestClass"),
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Int,
                Token.Identifier.ParameterName("x"),
                Token.Punctuation.Comma,
                Token.PrimitiveType.Int,
                Token.Identifier.ParameterName("y"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace]);
        });

        it("instance constructor with expression body", async () => {
            const input = Input.InClass(`TestClass(int x, int y) => Foo();`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Identifier.MethodName("TestClass"),
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Int,
                Token.Identifier.ParameterName("x"),
                Token.Punctuation.Comma,
                Token.PrimitiveType.Int,
                Token.Identifier.ParameterName("y"),
                Token.Punctuation.CloseParen,
                Token.Operator.Arrow,
                Token.Identifier.MethodName("Foo"),
                Token.Punctuation.OpenParen,
                Token.Punctuation.CloseParen,
                Token.Punctuation.Semicolon]);
        });

        it("static constructor no parameters", async () => {
            const input = Input.InClass(`TestClass() { }`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Identifier.MethodName("TestClass"),
                Token.Punctuation.OpenParen,
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace]);
        });

        it("instance constructor with 'this' initializer", async () => {
            const input = Input.InClass(`TestClass() : this(42) { }`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Identifier.MethodName("TestClass"),
                Token.Punctuation.OpenParen,
                Token.Punctuation.CloseParen,
                Token.Punctuation.Colon,
                Token.Variable.This,
                Token.Punctuation.OpenParen,
                Token.Literal.Numeric.Decimal("42"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace]);
        });

        it("public instance constructor with 'this' initializer", async () => {
            const input = Input.InClass(`public TestClass() : this(42) { }`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Modifier.Public,
                Token.Identifier.MethodName("TestClass"),
                Token.Punctuation.OpenParen,
                Token.Punctuation.CloseParen,
                Token.Punctuation.Colon,
                Token.Variable.This,
                Token.Punctuation.OpenParen,
                Token.Literal.Numeric.Decimal("42"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace]);
        });

        it("instance constructor with 'this' initializer with ref parameter", async () => {
            const input = Input.InClass(`TestClass(int x) : this(ref x) { }`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Identifier.MethodName("TestClass"),
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Int,
                Token.Identifier.ParameterName("x"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.Colon,
                Token.Variable.This,
                Token.Punctuation.OpenParen,
                Token.Keyword.Modifier.Ref,
                Token.Variable.ReadWrite("x"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace]);
        });

        it("instance constructor with 'this' initializer with named parameter", async () => {
            const input = Input.InClass(`TestClass(int x) : this(y: x) { }`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Identifier.MethodName("TestClass"),
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Int,
                Token.Identifier.ParameterName("x"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.Colon,
                Token.Variable.This,
                Token.Punctuation.OpenParen,
                Token.Identifier.ParameterName("y"),
                Token.Punctuation.Colon,
                Token.Variable.ReadWrite("x"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace]);
        });

        it("instance constructor with 'base' initializer", async () => {
            const input = Input.InClass(`TestClass() : base(42) { }`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Identifier.MethodName("TestClass"),
                Token.Punctuation.OpenParen,
                Token.Punctuation.CloseParen,
                Token.Punctuation.Colon,
                Token.Variable.Base,
                Token.Punctuation.OpenParen,
                Token.Literal.Numeric.Decimal("42"),
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
                Token.Identifier.MethodName("TestClass"),
                Token.Punctuation.OpenParen,
                Token.Punctuation.CloseParen,
                Token.Punctuation.Colon,
                Token.Variable.Base,
                Token.Punctuation.OpenParen,
                Token.Literal.Numeric.Decimal("42"),
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
                Token.Identifier.MethodName("WaitHandle"),
                Token.Punctuation.OpenParen,
                Token.Type("Task"),
                Token.Identifier.ParameterName("self"),
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
                Token.Identifier.ClassName("A"),
                Token.Punctuation.OpenBrace,
                Token.Keyword.Modifier.Public,
                Token.Identifier.MethodName("A"),
                Token.Punctuation.OpenParen,
                Token.Punctuation.CloseParen,
                Token.Punctuation.Colon,
                Token.Variable.Base,
                Token.Punctuation.OpenParen,
                Token.Literal.Numeric.Decimal("1"),
                Token.Punctuation.Comma,
                Token.Punctuation.String.Begin,
                Token.Literal.String("abc"),
                Token.Punctuation.String.End,
                Token.Operator.Expression.New,
                Token.Type("B"),
                Token.Punctuation.TypeParameter.Begin,
                Token.PrimitiveType.Char,
                Token.Punctuation.TypeParameter.End,
                Token.Punctuation.OpenParen,
                Token.Punctuation.CloseParen,
                Token.Punctuation.Comma,
                Token.Operator.Expression.New,
                Token.Type("B"),
                Token.Punctuation.TypeParameter.Begin,
                Token.PrimitiveType.String,
                Token.Punctuation.TypeParameter.End,
                Token.Punctuation.OpenParen,
                Token.Punctuation.CloseParen,
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Keyword.Definition.Var,
                Token.Identifier.LocalName("a"),
                Token.Operator.Assignment,
                Token.Literal.Numeric.Decimal("1"),
                Token.Punctuation.Semicolon,
                Token.Keyword.Definition.Var,
                Token.Identifier.LocalName("b"),
                Token.Operator.Assignment,
                Token.Punctuation.String.Begin,
                Token.Literal.String("abc"),
                Token.Punctuation.String.End,
                Token.Punctuation.Semicolon,
                Token.Keyword.Definition.Var,
                Token.Identifier.LocalName("c"),
                Token.Operator.Assignment,
                Token.Operator.Expression.New,
                Token.Type("B"),
                Token.Punctuation.TypeParameter.Begin,
                Token.PrimitiveType.Char,
                Token.Punctuation.TypeParameter.End,
                Token.Punctuation.OpenParen,
                Token.Punctuation.CloseParen,
                Token.Punctuation.Semicolon,
                Token.Keyword.Definition.Var,
                Token.Identifier.LocalName("c"),
                Token.Operator.Assignment,
                Token.Operator.Expression.New,
                Token.Type("B"),
                Token.Punctuation.TypeParameter.Begin,
                Token.PrimitiveType.String,
                Token.Punctuation.TypeParameter.End,
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
                Token.Identifier.MethodName("C"),
                Token.Punctuation.OpenParen,

                Token.PrimitiveType.String,
                Token.Identifier.ParameterName("s"),

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
                Token.Identifier.MethodName("AccountController"),
                Token.Punctuation.OpenParen,

                Token.Type("UserManager"),
                Token.Punctuation.TypeParameter.Begin,
                Token.Type("User"),
                Token.Punctuation.TypeParameter.End,
                Token.Identifier.ParameterName("userManager"),
                Token.Punctuation.Comma,

                Token.Type("SignInManager"),
                Token.Punctuation.TypeParameter.Begin,
                Token.Type("User"),
                Token.Punctuation.TypeParameter.End,
                Token.Identifier.ParameterName("signInManager"),
                Token.Punctuation.Comma,

                Token.Type("ILogger"),
                Token.Punctuation.TypeParameter.Begin,
                Token.Type("AccountController"),
                Token.Punctuation.TypeParameter.End,
                Token.Identifier.ParameterName("logger"),

                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace
            ]);
        });

        it("opening parenthesis on new line (issue dotnet/vscode-csharp#4190)", async () => {
            const input = Input.InClass(`
public TestClass
(
    string s
)
{
}

public void Method()
{
}`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Modifier.Public,
                Token.Identifier.MethodName("TestClass"),
                Token.Punctuation.OpenParen,

                Token.PrimitiveType.String,
                Token.Identifier.ParameterName("s"),

                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace,

                Token.Keyword.Modifier.Public,
                Token.PrimitiveType.Void,
                Token.Identifier.MethodName("Method"),
                Token.Punctuation.OpenParen,
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace
            ]);
        });
    });
});
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { should } from 'chai';
import { tokenize, Input, Token } from './utils/tokenize';

describe("Methods", () => {
    before(() => { should(); });

    describe("Methods", () => {
        it("single-line declaration with no parameters", async () => {
            const input = Input.InClass(`void Foo() { }`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.PrimitiveType.Void,
                Token.Identifier.MethodName("Foo"),
                Token.Punctuation.OpenParen,
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace]);
        });

        it("declaration with two parameters", async () => {
            const input = Input.InClass(`
int Add(int x, int y)
{
    return x + y;
}`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.PrimitiveType.Int,
                Token.Identifier.MethodName("Add"),
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Int,
                Token.Identifier.ParameterName("x"),
                Token.Punctuation.Comma,
                Token.PrimitiveType.Int,
                Token.Identifier.ParameterName("y"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Keyword.Flow.Return,
                Token.Variable.ReadWrite("x"),
                Token.Operator.Arithmetic.Addition,
                Token.Variable.ReadWrite("y"),
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace]);
        });

        it("declaration in with generic constraints", async () => {
            const input = Input.InClass(`TResult GetString<T, TResult>(T arg) where T : TResult { }`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Type("TResult"),
                Token.Identifier.MethodName("GetString"),
                Token.Punctuation.TypeParameter.Begin,
                Token.Identifier.TypeParameterName("T"),
                Token.Punctuation.Comma,
                Token.Identifier.TypeParameterName("TResult"),
                Token.Punctuation.TypeParameter.End,
                Token.Punctuation.OpenParen,
                Token.Type("T"),
                Token.Identifier.ParameterName("arg"),
                Token.Punctuation.CloseParen,
                Token.Keyword.Modifier.Where,
                Token.Identifier.TypeParameterName("T"),
                Token.Punctuation.Colon,
                Token.Type("TResult"),
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace]);
        });

        it("expression body", async () => {
            const input = Input.InClass(`int Add(int x, int y) => x + y;`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.PrimitiveType.Int,
                Token.Identifier.MethodName("Add"),
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Int,
                Token.Identifier.ParameterName("x"),
                Token.Punctuation.Comma,
                Token.PrimitiveType.Int,
                Token.Identifier.ParameterName("y"),
                Token.Punctuation.CloseParen,
                Token.Operator.Arrow,
                Token.Variable.ReadWrite("x"),
                Token.Operator.Arithmetic.Addition,
                Token.Variable.ReadWrite("y"),
                Token.Punctuation.Semicolon]);
        });

        it("explicitly-implemented interface member", async () => {
            const input = Input.InClass(`string IFoo<string>.GetString();`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.PrimitiveType.String,
                Token.Type("IFoo"),
                Token.Punctuation.TypeParameter.Begin,
                Token.PrimitiveType.String,
                Token.Punctuation.TypeParameter.End,
                Token.Punctuation.Accessor,
                Token.Identifier.MethodName("GetString"),
                Token.Punctuation.OpenParen,
                Token.Punctuation.CloseParen,
                Token.Punctuation.Semicolon]);
        });

        it("declaration in interface", async () => {
            const input = Input.InInterface(`string GetString();`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.PrimitiveType.String,
                Token.Identifier.MethodName("GetString"),
                Token.Punctuation.OpenParen,
                Token.Punctuation.CloseParen,
                Token.Punctuation.Semicolon]);
        });

        it("declaration in interface with parameters", async () => {
            const input = Input.InInterface(`string GetString(string format, params object[] args);`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.PrimitiveType.String,
                Token.Identifier.MethodName("GetString"),
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.String,
                Token.Identifier.ParameterName("format"),
                Token.Punctuation.Comma,
                Token.Keyword.Modifier.Params,
                Token.PrimitiveType.Object,
                Token.Punctuation.OpenBracket,
                Token.Punctuation.CloseBracket,
                Token.Identifier.ParameterName("args"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.Semicolon]);
        });

        it("declaration in interface with generic constraints", async () => {
            const input = Input.InInterface(`TResult GetString<T, TResult>(T arg) where T : TResult;`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Type("TResult"),
                Token.Identifier.MethodName("GetString"),
                Token.Punctuation.TypeParameter.Begin,
                Token.Identifier.TypeParameterName("T"),
                Token.Punctuation.Comma,
                Token.Identifier.TypeParameterName("TResult"),
                Token.Punctuation.TypeParameter.End,
                Token.Punctuation.OpenParen,
                Token.Type("T"),
                Token.Identifier.ParameterName("arg"),
                Token.Punctuation.CloseParen,
                Token.Keyword.Modifier.Where,
                Token.Identifier.TypeParameterName("T"),
                Token.Punctuation.Colon,
                Token.Type("TResult"),
                Token.Punctuation.Semicolon]);
        });

        it("declaration in interface with default implementation", async () => {
            const input = Input.InInterface(`
int Add(int x, int y)
{
    return x + y;
}`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.PrimitiveType.Int,
                Token.Identifier.MethodName("Add"),
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Int,
                Token.Identifier.ParameterName("x"),
                Token.Punctuation.Comma,
                Token.PrimitiveType.Int,
                Token.Identifier.ParameterName("y"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Keyword.Flow.Return,
                Token.Variable.ReadWrite("x"),
                Token.Operator.Arithmetic.Addition,
                Token.Variable.ReadWrite("y"),
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace]);
        });

        it("public override", async () => {
            const input = Input.InClass(`public override M() { }`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Modifier.Public,
                Token.Keyword.Modifier.Override,
                Token.Identifier.MethodName("M"),
                Token.Punctuation.OpenParen,
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace
            ]);
        });

        it("public virtual", async () => {
            const input = Input.InClass(`public virtual M() { }`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Modifier.Public,
                Token.Keyword.Modifier.Virtual,
                Token.Identifier.MethodName("M"),
                Token.Punctuation.OpenParen,
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace
            ]);
        });

        it("extension method", async () => {
            const input = Input.InClass(`public void M(this object o) { }`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Modifier.Public,
                Token.PrimitiveType.Void,
                Token.Identifier.MethodName("M"),
                Token.Punctuation.OpenParen,
                Token.Keyword.Modifier.This,
                Token.PrimitiveType.Object,
                Token.Identifier.ParameterName("o"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace
            ]);
        });

        it("commented parameters are highlighted properly (issue omnisharp-vscode#802)", async () => {
            const input = Input.InClass(`public void methodWithParametersCommented(int p1, /*int p2*/, int p3) {}`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Modifier.Public,
                Token.PrimitiveType.Void,
                Token.Identifier.MethodName("methodWithParametersCommented"),
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Int,
                Token.Identifier.ParameterName("p1"),
                Token.Punctuation.Comma,
                Token.Comment.MultiLine.Start,
                Token.Comment.MultiLine.Text("int p2"),
                Token.Comment.MultiLine.End,
                Token.Punctuation.Comma,
                Token.PrimitiveType.Int,
                Token.Identifier.ParameterName("p3"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace
            ]);
        });

        it("return type is highlighted properly in interface (issue omnisharp-vscode#830)", async () => {
            const input = `
public interface test
{
    Task test1(List<string> blah);
    Task test<T>(List<T> blah);
}`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Modifier.Public,
                Token.Keyword.Definition.Interface,
                Token.Identifier.InterfaceName("test"),
                Token.Punctuation.OpenBrace,
                Token.Type("Task"),
                Token.Identifier.MethodName("test1"),
                Token.Punctuation.OpenParen,
                Token.Type("List"),
                Token.Punctuation.TypeParameter.Begin,
                Token.PrimitiveType.String,
                Token.Punctuation.TypeParameter.End,
                Token.Identifier.ParameterName("blah"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.Semicolon,
                Token.Type("Task"),
                Token.Identifier.MethodName("test"),
                Token.Punctuation.TypeParameter.Begin,
                Token.Identifier.TypeParameterName("T"),
                Token.Punctuation.TypeParameter.End,
                Token.Punctuation.OpenParen,
                Token.Type("List"),
                Token.Punctuation.TypeParameter.Begin,
                Token.Type("T"),
                Token.Punctuation.TypeParameter.End,
                Token.Identifier.ParameterName("blah"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace
            ]);
        });

        it("attributes are highlighted properly (issue omnisharp-vscode#829)", async () => {
            const input = `
namespace Test
{
    public class TestClass
    {
        [HttpPut]
        [Route("/meetups/{id}/users-going")]
        public void AddToGoingUsers(Guid id, string user) => _commandSender.Send(new MarkUserAsGoing(id, user.User));

        [HttpPut]
        [Route("/meetups/{id}/users-not-going")]
        public void AddToNotGoingUsers(Guid id, string user) => _commandSender.Send(new MarkUserAsNotGoing(id, user.User));

        [HttpPut]
        [Route("/meetups/{id}/users-not-sure-if-going")]
        public void AddToNotSureIfGoingUsers(Guid id, string user) => _commandSender.Send(new MarkUserAsNotSureIfGoing(id, user.User));
    }
}`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Definition.Namespace,
                Token.Identifier.NamespaceName("Test"),
                Token.Punctuation.OpenBrace,
                Token.Keyword.Modifier.Public,
                Token.Keyword.Definition.Class,
                Token.Identifier.ClassName("TestClass"),
                Token.Punctuation.OpenBrace,

                // [HttpPut]
                // [Route("/meetups/{id}/users-going")]
                // public void AddToGoingUsers(Guid id, string user) => _commandSender.Send(new MarkUserAsGoing(id, user.User));
                Token.Punctuation.OpenBracket,
                Token.Type("HttpPut"),
                Token.Punctuation.CloseBracket,
                Token.Punctuation.OpenBracket,
                Token.Type("Route"),
                Token.Punctuation.OpenParen,
                Token.Punctuation.String.Begin,
                Token.Literal.String("/meetups/{id}/users-going"),
                Token.Punctuation.String.End,
                Token.Punctuation.CloseParen,
                Token.Punctuation.CloseBracket,
                Token.Keyword.Modifier.Public,
                Token.PrimitiveType.Void,
                Token.Identifier.MethodName("AddToGoingUsers"),
                Token.Punctuation.OpenParen,
                Token.Type("Guid"),
                Token.Identifier.ParameterName("id"),
                Token.Punctuation.Comma,
                Token.PrimitiveType.String,
                Token.Identifier.ParameterName("user"),
                Token.Punctuation.CloseParen,
                Token.Operator.Arrow,
                Token.Variable.Object("_commandSender"),
                Token.Punctuation.Accessor,
                Token.Identifier.MethodName("Send"),
                Token.Punctuation.OpenParen,
                Token.Operator.Expression.New,
                Token.Type("MarkUserAsGoing"),
                Token.Punctuation.OpenParen,
                Token.Variable.ReadWrite("id"),
                Token.Punctuation.Comma,
                Token.Variable.Object("user"),
                Token.Punctuation.Accessor,
                Token.Variable.Property("User"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.CloseParen,
                Token.Punctuation.Semicolon,

                // [HttpPut]
                // [Route("/meetups/{id}/users-not-going")]
                // public void AddToNotGoingUsers(Guid id, string user) => _commandSender.Send(new MarkUserAsNotGoing(id, user.User));
                Token.Punctuation.OpenBracket,
                Token.Type("HttpPut"),
                Token.Punctuation.CloseBracket,
                Token.Punctuation.OpenBracket,
                Token.Type("Route"),
                Token.Punctuation.OpenParen,
                Token.Punctuation.String.Begin,
                Token.Literal.String("/meetups/{id}/users-not-going"),
                Token.Punctuation.String.End,
                Token.Punctuation.CloseParen,
                Token.Punctuation.CloseBracket,
                Token.Keyword.Modifier.Public,
                Token.PrimitiveType.Void,
                Token.Identifier.MethodName("AddToNotGoingUsers"),
                Token.Punctuation.OpenParen,
                Token.Type("Guid"),
                Token.Identifier.ParameterName("id"),
                Token.Punctuation.Comma,
                Token.PrimitiveType.String,
                Token.Identifier.ParameterName("user"),
                Token.Punctuation.CloseParen,
                Token.Operator.Arrow,
                Token.Variable.Object("_commandSender"),
                Token.Punctuation.Accessor,
                Token.Identifier.MethodName("Send"),
                Token.Punctuation.OpenParen,
                Token.Operator.Expression.New,
                Token.Type("MarkUserAsNotGoing"),
                Token.Punctuation.OpenParen,
                Token.Variable.ReadWrite("id"),
                Token.Punctuation.Comma,
                Token.Variable.Object("user"),
                Token.Punctuation.Accessor,
                Token.Variable.Property("User"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.CloseParen,
                Token.Punctuation.Semicolon,

                // [HttpPut]
                // [Route("/meetups/{id}/users-not-sure-if-going")]
                // public void AddToNotSureIfGoingUsers(Guid id, string user) => _commandSender.Send(new MarkUserAsNotSureIfGoing(id, user.User));
                Token.Punctuation.OpenBracket,
                Token.Type("HttpPut"),
                Token.Punctuation.CloseBracket,
                Token.Punctuation.OpenBracket,
                Token.Type("Route"),
                Token.Punctuation.OpenParen,
                Token.Punctuation.String.Begin,
                Token.Literal.String("/meetups/{id}/users-not-sure-if-going"),
                Token.Punctuation.String.End,
                Token.Punctuation.CloseParen,
                Token.Punctuation.CloseBracket,
                Token.Keyword.Modifier.Public,
                Token.PrimitiveType.Void,
                Token.Identifier.MethodName("AddToNotSureIfGoingUsers"),
                Token.Punctuation.OpenParen,
                Token.Type("Guid"),
                Token.Identifier.ParameterName("id"),
                Token.Punctuation.Comma,
                Token.PrimitiveType.String,
                Token.Identifier.ParameterName("user"),
                Token.Punctuation.CloseParen,
                Token.Operator.Arrow,
                Token.Variable.Object("_commandSender"),
                Token.Punctuation.Accessor,
                Token.Identifier.MethodName("Send"),
                Token.Punctuation.OpenParen,
                Token.Operator.Expression.New,
                Token.Type("MarkUserAsNotSureIfGoing"),
                Token.Punctuation.OpenParen,
                Token.Variable.ReadWrite("id"),
                Token.Punctuation.Comma,
                Token.Variable.Object("user"),
                Token.Punctuation.Accessor,
                Token.Variable.Property("User"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.CloseParen,
                Token.Punctuation.Semicolon,

                Token.Punctuation.CloseBrace,
                Token.Punctuation.CloseBrace
            ]);
        });

        it("shadowed methods are highlighted properly (issue omnisharp-vscode#1084)", async () => {
            const input = Input.InClass(`
private new void foo1() //Correct highlight
{
}

new void foo2() //Function name not highlighted
{
}
`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Modifier.Private,
                Token.Keyword.Modifier.New,
                Token.PrimitiveType.Void,
                Token.Identifier.MethodName("foo1"),
                Token.Punctuation.OpenParen,
                Token.Punctuation.CloseParen,
                Token.Comment.SingleLine.Start,
                Token.Comment.SingleLine.Text("Correct highlight"),
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace,
                Token.Keyword.Modifier.New,
                Token.PrimitiveType.Void,
                Token.Identifier.MethodName("foo2"),
                Token.Punctuation.OpenParen,
                Token.Punctuation.CloseParen,
                Token.Comment.SingleLine.Start,
                Token.Comment.SingleLine.Text("Function name not highlighted"),
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace
            ]);
        });

        it("comment at end of line does not change highlights - 1 (issue omnisharp-vscode#1091)", async () => {
            const input = Input.InClass(`
public abstract void Notify(PlayerId playerId, ISessionResponse response); //the
`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Modifier.Public,
                Token.Keyword.Modifier.Abstract,
                Token.PrimitiveType.Void,
                Token.Identifier.MethodName("Notify"),
                Token.Punctuation.OpenParen,
                Token.Type("PlayerId"),
                Token.Identifier.ParameterName("playerId"),
                Token.Punctuation.Comma,
                Token.Type("ISessionResponse"),
                Token.Identifier.ParameterName("response"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.Semicolon,
                Token.Comment.SingleLine.Start,
                Token.Comment.SingleLine.Text("the")
            ]);
        });

        it("comment at end of line does not change highlights - 2 (issue omnisharp-vscode#1091)", async () => {
            const input = Input.InClass(`
public abstract void Notify(PlayerId playerId, ISessionResponse response); //the
`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Modifier.Public,
                Token.Keyword.Modifier.Abstract,
                Token.PrimitiveType.Void,
                Token.Identifier.MethodName("Notify"),
                Token.Punctuation.OpenParen,
                Token.Type("PlayerId"),
                Token.Identifier.ParameterName("playerId"),
                Token.Punctuation.Comma,
                Token.Type("ISessionResponse"),
                Token.Identifier.ParameterName("response"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.Semicolon,
                Token.Comment.SingleLine.Start,
                Token.Comment.SingleLine.Text("the")
            ]);
        });

        it("comment at end of line does not change highlights - 3 (issue omnisharp-vscode#1091)", async () => {
            const input = Input.InClass(`
public abstract void Notify(PlayerId playerId, ISessionResponse response); //the a
`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Modifier.Public,
                Token.Keyword.Modifier.Abstract,
                Token.PrimitiveType.Void,
                Token.Identifier.MethodName("Notify"),
                Token.Punctuation.OpenParen,
                Token.Type("PlayerId"),
                Token.Identifier.ParameterName("playerId"),
                Token.Punctuation.Comma,
                Token.Type("ISessionResponse"),
                Token.Identifier.ParameterName("response"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.Semicolon,
                Token.Comment.SingleLine.Start,
                Token.Comment.SingleLine.Text("the a")
            ]);
        });

        it("value is not incorrectly highlighted (issue omnisharp-vscode#268)", async () => {
            const input = `
namespace x {
public class ClassA<T>
{
   public class ClassAa<TT>
   {
      public bool MyMethod(string key, TT value)
      {
         return someObject.SomeCall(key, value); // on this line, 'value' is highlighted as though it were the keyword being used in a setter
      }
   }
}
}
`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Definition.Namespace,
                Token.Identifier.NamespaceName("x"),
                Token.Punctuation.OpenBrace,
                Token.Keyword.Modifier.Public,
                Token.Keyword.Definition.Class,
                Token.Identifier.ClassName("ClassA"),
                Token.Punctuation.TypeParameter.Begin,
                Token.Identifier.TypeParameterName("T"),
                Token.Punctuation.TypeParameter.End,
                Token.Punctuation.OpenBrace,
                Token.Keyword.Modifier.Public,
                Token.Keyword.Definition.Class,
                Token.Identifier.ClassName("ClassAa"),
                Token.Punctuation.TypeParameter.Begin,
                Token.Identifier.TypeParameterName("TT"),
                Token.Punctuation.TypeParameter.End,
                Token.Punctuation.OpenBrace,
                Token.Keyword.Modifier.Public,
                Token.PrimitiveType.Bool,
                Token.Identifier.MethodName("MyMethod"),
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.String,
                Token.Identifier.ParameterName("key"),
                Token.Punctuation.Comma,
                Token.Type("TT"),
                Token.Identifier.ParameterName("value"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Keyword.Flow.Return,
                Token.Variable.Object("someObject"),
                Token.Punctuation.Accessor,
                Token.Identifier.MethodName("SomeCall"),
                Token.Punctuation.OpenParen,
                Token.Variable.ReadWrite("key"),
                Token.Punctuation.Comma,
                Token.Variable.Value,
                Token.Punctuation.CloseParen,
                Token.Punctuation.Semicolon,
                Token.Comment.SingleLine.Start,
                Token.Comment.SingleLine.Text(" on this line, 'value' is highlighted as though it were the keyword being used in a setter"),
                Token.Punctuation.CloseBrace,
                Token.Punctuation.CloseBrace,
                Token.Punctuation.CloseBrace,
                Token.Punctuation.CloseBrace
            ]);
        });

        it("parameters with default values (issue #30)", async () => {
            const input = Input.InClass(`
void M(string p = null) { }
`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.PrimitiveType.Void,
                Token.Identifier.MethodName("M"),
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.String,
                Token.Identifier.ParameterName("p"),
                Token.Operator.Assignment,
                Token.Literal.Null,
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace
            ]);
        });

        it("ref return", async () => {
            const input = Input.InClass(`ref int M() { return ref x; }`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Modifier.Ref,
                Token.PrimitiveType.Int,
                Token.Identifier.MethodName("M"),
                Token.Punctuation.OpenParen,
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Keyword.Flow.Return,
                Token.Keyword.Modifier.Ref,
                Token.Variable.ReadWrite("x"),
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace
            ]);
        });

        it("ref readonly return", async () => {
            const input = Input.InClass(`ref readonly int M() { return ref x; }`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Modifier.Ref,
                Token.Keyword.Modifier.ReadOnly,
                Token.PrimitiveType.Int,
                Token.Identifier.MethodName("M"),
                Token.Punctuation.OpenParen,
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Keyword.Flow.Return,
                Token.Keyword.Modifier.Ref,
                Token.Variable.ReadWrite("x"),
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace
            ]);
        });

        it("expression body ref return", async () => {
            const input = Input.InClass(`ref int M() => ref x;`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Modifier.Ref,
                Token.PrimitiveType.Int,
                Token.Identifier.MethodName("M"),
                Token.Punctuation.OpenParen,
                Token.Punctuation.CloseParen,
                Token.Operator.Arrow,
                Token.Keyword.Modifier.Ref,
                Token.Variable.ReadWrite("x"),
                Token.Punctuation.Semicolon]);
        });

        it("expression body ref readonly return", async () => {
            const input = Input.InClass(`ref readonly int M() => ref x;`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Modifier.Ref,
                Token.Keyword.Modifier.ReadOnly,
                Token.PrimitiveType.Int,
                Token.Identifier.MethodName("M"),
                Token.Punctuation.OpenParen,
                Token.Punctuation.CloseParen,
                Token.Operator.Arrow,
                Token.Keyword.Modifier.Ref,
                Token.Variable.ReadWrite("x"),
                Token.Punctuation.Semicolon]);
        });

        it("closing parenthesis of parameter list on next line", async () => {
            const input = Input.InClass(`
void M(
    string s
    )
{
}`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.PrimitiveType.Void,
                Token.Identifier.MethodName("M"),
                Token.Punctuation.OpenParen,

                Token.PrimitiveType.String,
                Token.Identifier.ParameterName("s"),

                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace
            ]);
        });

        it("parameters with multi-dimensional arrays (issue #86)", async () => {
            const input = Input.InClass(`
public void LinearRegression(double[,] samples, double[] standardDeviations, int variables){
    int info;
    alglib.linearmodel linearmodel;
    alglib.lrreport ar;`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Modifier.Public,
                Token.PrimitiveType.Void,
                Token.Identifier.MethodName("LinearRegression"),
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Double,
                Token.Punctuation.OpenBracket,
                Token.Punctuation.Comma,
                Token.Punctuation.CloseBracket,
                Token.Identifier.ParameterName("samples"),
                Token.Punctuation.Comma,
                Token.PrimitiveType.Double,
                Token.Punctuation.OpenBracket,
                Token.Punctuation.CloseBracket,
                Token.Identifier.ParameterName("standardDeviations"),
                Token.Punctuation.Comma,
                Token.PrimitiveType.Int,
                Token.Identifier.ParameterName("variables"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.PrimitiveType.Int,
                Token.Identifier.LocalName("info"),
                Token.Punctuation.Semicolon,
                Token.Type("alglib"),
                Token.Punctuation.Accessor,
                Token.Type("linearmodel"),
                Token.Identifier.LocalName("linearmodel"),
                Token.Punctuation.Semicolon,
                Token.Type("alglib"),
                Token.Punctuation.Accessor,
                Token.Type("lrreport"),
                Token.Identifier.LocalName("ar"),
                Token.Punctuation.Semicolon,
            ]);
        });

        it("ref parameter in parameter list", async () => {
            const input = Input.InClass(`
public static Span<T> CreateSpan<T>(ref T reference, int length) {}
`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Modifier.Public,
                Token.Keyword.Modifier.Static,
                Token.Type("Span"),
                Token.Punctuation.TypeParameter.Begin,
                Token.Type("T"),
                Token.Punctuation.TypeParameter.End,
                Token.Identifier.MethodName("CreateSpan"),
                Token.Punctuation.TypeParameter.Begin,
                Token.Identifier.TypeParameterName("T"),
                Token.Punctuation.TypeParameter.End,
                Token.Punctuation.OpenParen,
                Token.Keyword.Modifier.Ref,
                Token.Type("T"),
                Token.Identifier.ParameterName("reference"),
                Token.Punctuation.Comma,
                Token.PrimitiveType.Int,
                Token.Identifier.ParameterName("length"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace
            ]);
        });

        it("scoped ref parameter in parameter list (#306)", async () => {
            const input = Input.InClass(`
public static Span<T> CreateSpan<T>(scoped ref T reference, int length) {}
`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Modifier.Public,
                Token.Keyword.Modifier.Static,
                Token.Type("Span"),
                Token.Punctuation.TypeParameter.Begin,
                Token.Type("T"),
                Token.Punctuation.TypeParameter.End,
                Token.Identifier.MethodName("CreateSpan"),
                Token.Punctuation.TypeParameter.Begin,
                Token.Identifier.TypeParameterName("T"),
                Token.Punctuation.TypeParameter.End,
                Token.Punctuation.OpenParen,
                Token.Keyword.Modifier.Scoped,
                Token.Keyword.Modifier.Ref,
                Token.Type("T"),
                Token.Identifier.ParameterName("reference"),
                Token.Punctuation.Comma,
                Token.PrimitiveType.Int,
                Token.Identifier.ParameterName("length"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace
            ]);
        });

        it("expression body and type constraint (issue #74)", async () => {
            const input = Input.InClass(`
T id1<T>(T a) => a;
T id2<T>(T a) where T : class => a;`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Type("T"),
                Token.Identifier.MethodName("id1"),
                Token.Punctuation.TypeParameter.Begin,
                Token.Identifier.TypeParameterName("T"),
                Token.Punctuation.TypeParameter.End,
                Token.Punctuation.OpenParen,
                Token.Type("T"),
                Token.Identifier.ParameterName("a"),
                Token.Punctuation.CloseParen,
                Token.Operator.Arrow,
                Token.Variable.ReadWrite("a"),
                Token.Punctuation.Semicolon,

                Token.Type("T"),
                Token.Identifier.MethodName("id2"),
                Token.Punctuation.TypeParameter.Begin,
                Token.Identifier.TypeParameterName("T"),
                Token.Punctuation.TypeParameter.End,
                Token.Punctuation.OpenParen,
                Token.Type("T"),
                Token.Identifier.ParameterName("a"),
                Token.Punctuation.CloseParen,
                Token.Keyword.Modifier.Where,
                Token.Identifier.TypeParameterName("T"),
                Token.Punctuation.Colon,
                Token.Keyword.Definition.Class,
                Token.Operator.Arrow,
                Token.Variable.ReadWrite("a"),
                Token.Punctuation.Semicolon
            ]);
        });

        it("readonly members in struct (C# 8)", async () => {
            const input = Input.InClass(`readonly int M() { return x; }`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Modifier.ReadOnly,
                Token.PrimitiveType.Int,
                Token.Identifier.MethodName("M"),
                Token.Punctuation.OpenParen,
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Keyword.Flow.Return,
                Token.Variable.ReadWrite("x"),
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace
            ]);
        });
    });
});

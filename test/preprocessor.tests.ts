/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { should } from 'chai';
import { tokenize, Input, Token } from './utils/tokenize';

describe("Preprocessor", () => {
    before(() => { should(); });

    describe("Preprocessor", () => {
        it("#define Foo", async () => {
            const input = `#define Foo`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.Hash,
                Token.Keyword.Preprocessor.Define,
                Token.Identifier.PreprocessorSymbol("Foo")
            ]);
        });

        it("#define Foo//Foo", async () => {
            const input = `#define Foo//Foo`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.Hash,
                Token.Keyword.Preprocessor.Define,
                Token.Identifier.PreprocessorSymbol("Foo"),
                Token.Comment.SingleLine.Start,
                Token.Comment.SingleLine.Text("Foo")
            ]);
        });

        it("#define Foo //Foo", async () => {
            const input = `#define Foo //Foo`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.Hash,
                Token.Keyword.Preprocessor.Define,
                Token.Identifier.PreprocessorSymbol("Foo"),
                Token.Comment.SingleLine.Start,
                Token.Comment.SingleLine.Text("Foo")
            ]);
        });

        it("#undef Foo", async () => {
            const input = `#undef Foo`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.Hash,
                Token.Keyword.Preprocessor.Undef,
                Token.Identifier.PreprocessorSymbol("Foo")
            ]);
        });

        it("#undef Foo//Foo", async () => {
            const input = `#undef Foo//Foo`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.Hash,
                Token.Keyword.Preprocessor.Undef,
                Token.Identifier.PreprocessorSymbol("Foo"),
                Token.Comment.SingleLine.Start,
                Token.Comment.SingleLine.Text("Foo")
            ]);
        });

        it("#undef Foo //Foo", async () => {
            const input = `#undef Foo //Foo`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.Hash,
                Token.Keyword.Preprocessor.Undef,
                Token.Identifier.PreprocessorSymbol("Foo"),
                Token.Comment.SingleLine.Start,
                Token.Comment.SingleLine.Text("Foo")
            ]);
        });

        it("#if true", async () => {
            const input = `#if true`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.Hash,
                Token.Keyword.Preprocessor.If,
                Token.Literal.Boolean.True
            ]);
        });

        it("#if false", async () => {
            const input = `#if false`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.Hash,
                Token.Keyword.Preprocessor.If,
                Token.Literal.Boolean.False
            ]);
        });

        it("#if Foo", async () => {
            const input = `#if Foo`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.Hash,
                Token.Keyword.Preprocessor.If,
                Token.Identifier.PreprocessorSymbol("Foo")
            ]);
        });

        it("#if Foo || true", async () => {
            const input = `#if Foo || true`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.Hash,
                Token.Keyword.Preprocessor.If,
                Token.Identifier.PreprocessorSymbol("Foo"),
                Token.Operator.Logical.Or,
                Token.Literal.Boolean.True
            ]);
        });

        it("#if Foo && true", async () => {
            const input = `#if Foo && true`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.Hash,
                Token.Keyword.Preprocessor.If,
                Token.Identifier.PreprocessorSymbol("Foo"),
                Token.Operator.Logical.And,
                Token.Literal.Boolean.True
            ]);
        });

        it("#if Foo == true", async () => {
            const input = `#if Foo == true`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.Hash,
                Token.Keyword.Preprocessor.If,
                Token.Identifier.PreprocessorSymbol("Foo"),
                Token.Operator.Relational.Equals,
                Token.Literal.Boolean.True
            ]);
        });

        it("#if Foo != true", async () => {
            const input = `#if Foo != true`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.Hash,
                Token.Keyword.Preprocessor.If,
                Token.Identifier.PreprocessorSymbol("Foo"),
                Token.Operator.Relational.NotEqual,
                Token.Literal.Boolean.True
            ]);
        });

        it("#if !Foo", async () => {
            const input = `#if !Foo`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.Hash,
                Token.Keyword.Preprocessor.If,
                Token.Operator.Logical.Not,
                Token.Identifier.PreprocessorSymbol("Foo")
            ]);
        });

        it("#if (Foo != true) && Bar", async () => {
            const input = `#if (Foo != true) && Bar`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.Hash,
                Token.Keyword.Preprocessor.If,
                Token.Punctuation.OpenParen,
                Token.Identifier.PreprocessorSymbol("Foo"),
                Token.Operator.Relational.NotEqual,
                Token.Literal.Boolean.True,
                Token.Punctuation.CloseParen,
                Token.Operator.Logical.And,
                Token.Identifier.PreprocessorSymbol("Bar")
            ]);
        });

        it("#if (Foo != true) && Bar //Foo", async () => {
            const input = `#if (Foo != true) && Bar //Foo`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.Hash,
                Token.Keyword.Preprocessor.If,
                Token.Punctuation.OpenParen,
                Token.Identifier.PreprocessorSymbol("Foo"),
                Token.Operator.Relational.NotEqual,
                Token.Literal.Boolean.True,
                Token.Punctuation.CloseParen,
                Token.Operator.Logical.And,
                Token.Identifier.PreprocessorSymbol("Bar"),
                Token.Comment.SingleLine.Start,
                Token.Comment.SingleLine.Text("Foo")
            ]);
        });

        it("#elif true", async () => {
            const input = `#elif true`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.Hash,
                Token.Keyword.Preprocessor.ElIf,
                Token.Literal.Boolean.True
            ]);
        });

        it("#elif false", async () => {
            const input = `#elif false`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.Hash,
                Token.Keyword.Preprocessor.ElIf,
                Token.Literal.Boolean.False
            ]);
        });

        it("#elif Foo", async () => {
            const input = `#elif Foo`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.Hash,
                Token.Keyword.Preprocessor.ElIf,
                Token.Identifier.PreprocessorSymbol("Foo")
            ]);
        });

        it("#elif Foo || true", async () => {
            const input = `#elif Foo || true`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.Hash,
                Token.Keyword.Preprocessor.ElIf,
                Token.Identifier.PreprocessorSymbol("Foo"),
                Token.Operator.Logical.Or,
                Token.Literal.Boolean.True
            ]);
        });

        it("#elif Foo && true", async () => {
            const input = `#elif Foo && true`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.Hash,
                Token.Keyword.Preprocessor.ElIf,
                Token.Identifier.PreprocessorSymbol("Foo"),
                Token.Operator.Logical.And,
                Token.Literal.Boolean.True
            ]);
        });

        it("#elif Foo == true", async () => {
            const input = `#elif Foo == true`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.Hash,
                Token.Keyword.Preprocessor.ElIf,
                Token.Identifier.PreprocessorSymbol("Foo"),
                Token.Operator.Relational.Equals,
                Token.Literal.Boolean.True
            ]);
        });

        it("#elif Foo != true", async () => {
            const input = `#elif Foo != true`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.Hash,
                Token.Keyword.Preprocessor.ElIf,
                Token.Identifier.PreprocessorSymbol("Foo"),
                Token.Operator.Relational.NotEqual,
                Token.Literal.Boolean.True
            ]);
        });

        it("#elif !Foo", async () => {
            const input = `#elif !Foo`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.Hash,
                Token.Keyword.Preprocessor.ElIf,
                Token.Operator.Logical.Not,
                Token.Identifier.PreprocessorSymbol("Foo")
            ]);
        });

        it("#elif (Foo != true) && Bar", async () => {
            const input = `#elif (Foo != true) && Bar`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.Hash,
                Token.Keyword.Preprocessor.ElIf,
                Token.Punctuation.OpenParen,
                Token.Identifier.PreprocessorSymbol("Foo"),
                Token.Operator.Relational.NotEqual,
                Token.Literal.Boolean.True,
                Token.Punctuation.CloseParen,
                Token.Operator.Logical.And,
                Token.Identifier.PreprocessorSymbol("Bar")
            ]);
        });

        it("#elif (Foo != true) && Bar//Foo", async () => {
            const input = `#elif (Foo != true) && Bar//Foo`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.Hash,
                Token.Keyword.Preprocessor.ElIf,
                Token.Punctuation.OpenParen,
                Token.Identifier.PreprocessorSymbol("Foo"),
                Token.Operator.Relational.NotEqual,
                Token.Literal.Boolean.True,
                Token.Punctuation.CloseParen,
                Token.Operator.Logical.And,
                Token.Identifier.PreprocessorSymbol("Bar"),
                Token.Comment.SingleLine.Start,
                Token.Comment.SingleLine.Text("Foo")
            ]);
        });

        it("#elif (Foo != true) && Bar //Foo", async () => {
            const input = `#elif (Foo != true) && Bar //Foo`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.Hash,
                Token.Keyword.Preprocessor.ElIf,
                Token.Punctuation.OpenParen,
                Token.Identifier.PreprocessorSymbol("Foo"),
                Token.Operator.Relational.NotEqual,
                Token.Literal.Boolean.True,
                Token.Punctuation.CloseParen,
                Token.Operator.Logical.And,
                Token.Identifier.PreprocessorSymbol("Bar"),
                Token.Comment.SingleLine.Start,
                Token.Comment.SingleLine.Text("Foo")
            ]);
        });

        it("#else", async () => {
            const input = `#else`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.Hash,
                Token.Keyword.Preprocessor.Else,
            ]);
        });

        it("#else//Foo", async () => {
            const input = `#else//Foo`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.Hash,
                Token.Keyword.Preprocessor.Else,
                Token.Comment.SingleLine.Start,
                Token.Comment.SingleLine.Text("Foo")
            ]);
        });

        it("#else //Foo", async () => {
            const input = `#else //Foo`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.Hash,
                Token.Keyword.Preprocessor.Else,
                Token.Comment.SingleLine.Start,
                Token.Comment.SingleLine.Text("Foo")
            ]);
        });

        it("#endif", async () => {
            const input = `#endif`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.Hash,
                Token.Keyword.Preprocessor.EndIf,
            ]);
        });

        it("#endif//Foo", async () => {
            const input = `#endif//Foo`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.Hash,
                Token.Keyword.Preprocessor.EndIf,
                Token.Comment.SingleLine.Start,
                Token.Comment.SingleLine.Text("Foo")
            ]);
        });

        it("#endif //Foo", async () => {
            const input = `#endif //Foo`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.Hash,
                Token.Keyword.Preprocessor.EndIf,
                Token.Comment.SingleLine.Start,
                Token.Comment.SingleLine.Text("Foo")
            ]);
        });

        it("#warning This is a warning", async () => {
            const input = `#warning This is a warning`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.Hash,
                Token.Keyword.Preprocessor.Warning,
                Token.PreprocessorMessage("This is a warning")
            ]);
        });

        it("#error This is an error", async () => {
            const input = `#error This is an error`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.Hash,
                Token.Keyword.Preprocessor.Error,
                Token.PreprocessorMessage("This is an error")
            ]);
        });

        it("#region My Region", async () => {
            const input = `#region My Region`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.Hash,
                Token.Keyword.Preprocessor.Region,
                Token.PreprocessorMessage("My Region")
            ]);
        });

        it("#region \"My Region\"", async () => {
            const input = `#region "My Region"`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.Hash,
                Token.Keyword.Preprocessor.Region,
                Token.PreprocessorMessage("\"My Region\"")
            ]);
        });

        it("#endregion", async () => {
            const input = `#endregion`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.Hash,
                Token.Keyword.Preprocessor.EndRegion
            ]);
        });

        it("#endregion//Foo", async () => {
            const input = `#endregion//Foo`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.Hash,
                Token.Keyword.Preprocessor.EndRegion,
                Token.Comment.SingleLine.Start,
                Token.Comment.SingleLine.Text("Foo")
            ]);
        });

        it("#endregion //Foo", async () => {
            const input = `#endregion //Foo`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.Hash,
                Token.Keyword.Preprocessor.EndRegion,
                Token.Comment.SingleLine.Start,
                Token.Comment.SingleLine.Text("Foo")
            ]);
        });

        it("preprocessor in enum members", async () => {
            const input = `
public enum E
{
    A,
    B = A,
    C = 2 + A,

#if DEBUG
    D,
#endif

}`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Modifier.Public,
                Token.Keyword.Definition.Enum,
                Token.Identifier.EnumName("E"),
                Token.Punctuation.OpenBrace,
                Token.Identifier.EnumMemberName("A"),
                Token.Punctuation.Comma,
                Token.Identifier.EnumMemberName("B"),
                Token.Operator.Assignment,
                Token.Variable.ReadWrite("A"),
                Token.Punctuation.Comma,
                Token.Identifier.EnumMemberName("C"),
                Token.Operator.Assignment,
                Token.Literal.Numeric.Decimal("2"),
                Token.Operator.Arithmetic.Addition,
                Token.Variable.ReadWrite("A"),
                Token.Punctuation.Comma,

                Token.Punctuation.Hash,
                Token.Keyword.Preprocessor.If,
                Token.Identifier.PreprocessorSymbol("DEBUG"),
                Token.Identifier.EnumMemberName("D"),
                Token.Punctuation.Comma,
                Token.Punctuation.Hash,
                Token.Keyword.Preprocessor.EndIf,

                Token.Punctuation.CloseBrace
            ]);
        });

        it("region name with double-quotes should be highlighted properly (issue omnisharp-vscode#731)", async () => {
            const input = Input.InClass(`
#region  " Register / Create New  "
// GET: /Account/Register
[Authorize(Roles = UserRoles.SuperUser)]
public ActionResult Register()
{
    RedirectToAction("Application");
    return View();
}
`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.Hash,
                Token.Keyword.Preprocessor.Region,
                Token.PreprocessorMessage("\" Register / Create New  \""),
                Token.Comment.SingleLine.Start,
                Token.Comment.SingleLine.Text(" GET: /Account/Register"),
                Token.Punctuation.OpenBracket,
                Token.Type("Authorize"),
                Token.Punctuation.OpenParen,
                Token.Identifier.PropertyName("Roles"),
                Token.Operator.Assignment,
                Token.Variable.Object("UserRoles"),
                Token.Punctuation.Accessor,
                Token.Variable.Property("SuperUser"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.CloseBracket,
                Token.Keyword.Modifier.Public,
                Token.Type("ActionResult"),
                Token.Identifier.MethodName("Register"),
                Token.Punctuation.OpenParen,
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Identifier.MethodName("RedirectToAction"),
                Token.Punctuation.OpenParen,
                Token.Punctuation.String.Begin,
                Token.Literal.String("Application"),
                Token.Punctuation.String.End,
                Token.Punctuation.CloseParen,
                Token.Punctuation.Semicolon,
                Token.Keyword.Flow.Return,
                Token.Identifier.MethodName("View"),
                Token.Punctuation.OpenParen,
                Token.Punctuation.CloseParen,
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace
            ]);
        });

        it("preprocessor in base lists (issue #32)", async () => {
            const input = Input.FromText(`
#if !PCL
    [Serializable]
#endif
    public struct Interval : IEquatable<Interval>, IXmlSerializable
#if !PCL
        , ISerializable
#endif
`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.Hash,
                Token.Keyword.Preprocessor.If,
                Token.Operator.Logical.Not,
                Token.Identifier.PreprocessorSymbol("PCL"),
                Token.Punctuation.OpenBracket,
                Token.Type("Serializable"),
                Token.Punctuation.CloseBracket,
                Token.Punctuation.Hash,
                Token.Keyword.Preprocessor.EndIf,
                Token.Keyword.Modifier.Public,
                Token.Keyword.Definition.Struct,
                Token.Identifier.StructName("Interval"),
                Token.Punctuation.Colon,
                Token.Type("IEquatable"),
                Token.Punctuation.TypeParameter.Begin,
                Token.Type("Interval"),
                Token.Punctuation.TypeParameter.End,
                Token.Punctuation.Comma,
                Token.Type("IXmlSerializable"),
                Token.Punctuation.Hash,
                Token.Keyword.Preprocessor.If,
                Token.Operator.Logical.Not,
                Token.Identifier.PreprocessorSymbol("PCL"),
                Token.Punctuation.Comma,
                Token.Type("ISerializable"),
                Token.Punctuation.Hash,
                Token.Keyword.Preprocessor.EndIf,
            ]);
        });

        it("#load", async () => {
            const input = "#load";
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.Hash,
                Token.Keyword.Preprocessor.Load
            ]);
        });

        it(`#load "foo.csx"`, async () => {
            const input = `#load "foo.csx"`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.Hash,
                Token.Keyword.Preprocessor.Load,
                Token.Literal.String(`"foo.csx"`)
            ]);
        });

        it("#r", async () => {
            const input = "#r";
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.Hash,
                Token.Keyword.Preprocessor.R
            ]);
        });

        it(`#r "System.Net.dll"`, async () => {
            const input = `#r "System.Net.dll"`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.Hash,
                Token.Keyword.Preprocessor.R,
                Token.Literal.String(`"System.Net.dll"`)
            ]);
        });
    });

    describe("AppDirectives", () => {
        it("#:package", async () => {
            const input = `#:package`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.Hash,
                Token.Punctuation.Colon,
                Token.Keyword.Preprocessor.Package,
            ]);
        });

        it("#:package with name", async () => {
            const input = `#:package Foo.Goo`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.Hash,
                Token.Punctuation.Colon,
                Token.Keyword.Preprocessor.Package,
                Token.Identifier.PreprocessorSymbol("Foo.Goo"),
            ]);
        });

        it("#:package with name and version", async () => {
            const input = `#:package Foo.Goo@1.0.0`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.Hash,
                Token.Punctuation.Colon,
                Token.Keyword.Preprocessor.Package,
                Token.Identifier.PreprocessorSymbol("Foo.Goo"),
                Token.Punctuation.At,
                Token.PreprocessorMessage("1.0.0"),
            ]);
        });

        it("#:project", async () => {
            const input = `#:project`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.Hash,
                Token.Punctuation.Colon,
                Token.Keyword.Preprocessor.Project,
            ]);
        });

        it("#:project with path", async () => {
            const input = `#:project ./path/to/project`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.Hash,
                Token.Punctuation.Colon,
                Token.Keyword.Preprocessor.Project,
                Token.PreprocessorMessage("./path/to/project"),
            ]);
        });

        it("#:property", async () => {
            const input = `#:property`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.Hash,
                Token.Punctuation.Colon,
                Token.Keyword.Preprocessor.Property,
            ]);
        });

        it("#:property with name", async () => {
            const input = `#:property Foo_Property`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.Hash,
                Token.Punctuation.Colon,
                Token.Keyword.Preprocessor.Property,
                Token.Identifier.PreprocessorSymbol("Foo_Property"),
            ]);
        });

        it("#:property with name and value", async () => {
            const input = `#:property Foo_Property=Some Value`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.Hash,
                Token.Punctuation.Colon,
                Token.Keyword.Preprocessor.Property,
                Token.Identifier.PreprocessorSymbol("Foo_Property"),
                Token.Punctuation.Equals,
                Token.PreprocessorMessage("Some Value"),
            ]);
        });

        it("#:sdk", async () => {
            const input = `#:sdk`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.Hash,
                Token.Punctuation.Colon,
                Token.Keyword.Preprocessor.Sdk,
            ]);
        });

        it("#:sdk with name", async () => {
            const input = `#:sdk Foo.Sdk`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.Hash,
                Token.Punctuation.Colon,
                Token.Keyword.Preprocessor.Sdk,
                Token.Identifier.PreprocessorSymbol("Foo.Sdk"),
            ]);
        });

        it("#:sdk with name and version", async () => {
            const input = `#:sdk Foo.Sdk@1.0.0`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.Hash,
                Token.Punctuation.Colon,
                Token.Keyword.Preprocessor.Sdk,
                Token.Identifier.PreprocessorSymbol("Foo.Sdk"),
                Token.Punctuation.At,
                Token.PreprocessorMessage("1.0.0"),
            ]);
        });
    });
});
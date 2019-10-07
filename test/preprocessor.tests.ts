/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { should } from 'chai';
import { tokenize, Input, Token } from './utils/tokenize';

describe("Grammar", () => {
    before(() => { should(); });

    describe("Preprocessor", () => {
        it("#define Foo", async () => {
            const input = `#define Foo`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.Hash,
                Token.Keywords.Preprocessor.Define,
                Token.Identifiers.PreprocessorSymbol("Foo")
            ]);
        });

        it("#define Foo//Foo", async () => {
            const input = `#define Foo//Foo`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.Hash,
                Token.Keywords.Preprocessor.Define,
                Token.Identifiers.PreprocessorSymbol("Foo"),
                Token.Comment.SingleLine.Start,
                Token.Comment.SingleLine.Text("Foo")
            ]);
        });

        it("#define Foo //Foo", async () => {
            const input = `#define Foo //Foo`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.Hash,
                Token.Keywords.Preprocessor.Define,
                Token.Identifiers.PreprocessorSymbol("Foo"),
                Token.Comment.SingleLine.Start,
                Token.Comment.SingleLine.Text("Foo")
            ]);
        });

        it("#undef Foo", async () => {
            const input = `#undef Foo`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.Hash,
                Token.Keywords.Preprocessor.Undef,
                Token.Identifiers.PreprocessorSymbol("Foo")
            ]);
        });

        it("#undef Foo//Foo", async () => {
            const input = `#undef Foo//Foo`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.Hash,
                Token.Keywords.Preprocessor.Undef,
                Token.Identifiers.PreprocessorSymbol("Foo"),
                Token.Comment.SingleLine.Start,
                Token.Comment.SingleLine.Text("Foo")
            ]);
        });

        it("#undef Foo //Foo", async () => {
            const input = `#undef Foo //Foo`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.Hash,
                Token.Keywords.Preprocessor.Undef,
                Token.Identifiers.PreprocessorSymbol("Foo"),
                Token.Comment.SingleLine.Start,
                Token.Comment.SingleLine.Text("Foo")
            ]);
        });

        it("#if true", async () => {
            const input = `#if true`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.Hash,
                Token.Keywords.Preprocessor.If,
                Token.Literals.Boolean.True
            ]);
        });

        it("#if false", async () => {
            const input = `#if false`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.Hash,
                Token.Keywords.Preprocessor.If,
                Token.Literals.Boolean.False
            ]);
        });

        it("#if Foo", async () => {
            const input = `#if Foo`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.Hash,
                Token.Keywords.Preprocessor.If,
                Token.Identifiers.PreprocessorSymbol("Foo")
            ]);
        });

        it("#if Foo || true", async () => {
            const input = `#if Foo || true`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.Hash,
                Token.Keywords.Preprocessor.If,
                Token.Identifiers.PreprocessorSymbol("Foo"),
                Token.Operators.Logical.Or,
                Token.Literals.Boolean.True
            ]);
        });

        it("#if Foo && true", async () => {
            const input = `#if Foo && true`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.Hash,
                Token.Keywords.Preprocessor.If,
                Token.Identifiers.PreprocessorSymbol("Foo"),
                Token.Operators.Logical.And,
                Token.Literals.Boolean.True
            ]);
        });

        it("#if Foo == true", async () => {
            const input = `#if Foo == true`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.Hash,
                Token.Keywords.Preprocessor.If,
                Token.Identifiers.PreprocessorSymbol("Foo"),
                Token.Operators.Relational.Equals,
                Token.Literals.Boolean.True
            ]);
        });

        it("#if Foo != true", async () => {
            const input = `#if Foo != true`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.Hash,
                Token.Keywords.Preprocessor.If,
                Token.Identifiers.PreprocessorSymbol("Foo"),
                Token.Operators.Relational.NotEqual,
                Token.Literals.Boolean.True
            ]);
        });

        it("#if !Foo", async () => {
            const input = `#if !Foo`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.Hash,
                Token.Keywords.Preprocessor.If,
                Token.Operators.Logical.Not,
                Token.Identifiers.PreprocessorSymbol("Foo")
            ]);
        });

        it("#if (Foo != true) && Bar", async () => {
            const input = `#if (Foo != true) && Bar`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.Hash,
                Token.Keywords.Preprocessor.If,
                Token.Punctuation.OpenParen,
                Token.Identifiers.PreprocessorSymbol("Foo"),
                Token.Operators.Relational.NotEqual,
                Token.Literals.Boolean.True,
                Token.Punctuation.CloseParen,
                Token.Operators.Logical.And,
                Token.Identifiers.PreprocessorSymbol("Bar")
            ]);
        });

        it("#if (Foo != true) && Bar //Foo", async () => {
            const input = `#if (Foo != true) && Bar //Foo`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.Hash,
                Token.Keywords.Preprocessor.If,
                Token.Punctuation.OpenParen,
                Token.Identifiers.PreprocessorSymbol("Foo"),
                Token.Operators.Relational.NotEqual,
                Token.Literals.Boolean.True,
                Token.Punctuation.CloseParen,
                Token.Operators.Logical.And,
                Token.Identifiers.PreprocessorSymbol("Bar"),
                Token.Comment.SingleLine.Start,
                Token.Comment.SingleLine.Text("Foo")
            ]);
        });

        it("#if (Foo != true) && Bar //Foo", async () => {
            const input = `#if (Foo != true) && Bar //Foo`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.Hash,
                Token.Keywords.Preprocessor.If,
                Token.Punctuation.OpenParen,
                Token.Identifiers.PreprocessorSymbol("Foo"),
                Token.Operators.Relational.NotEqual,
                Token.Literals.Boolean.True,
                Token.Punctuation.CloseParen,
                Token.Operators.Logical.And,
                Token.Identifiers.PreprocessorSymbol("Bar"),
                Token.Comment.SingleLine.Start,
                Token.Comment.SingleLine.Text("Foo")
            ]);
        });

        it("#elif true", async () => {
            const input = `#elif true`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.Hash,
                Token.Keywords.Preprocessor.ElIf,
                Token.Literals.Boolean.True
            ]);
        });

        it("#elif false", async () => {
            const input = `#elif false`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.Hash,
                Token.Keywords.Preprocessor.ElIf,
                Token.Literals.Boolean.False
            ]);
        });

        it("#elif Foo", async () => {
            const input = `#elif Foo`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.Hash,
                Token.Keywords.Preprocessor.ElIf,
                Token.Identifiers.PreprocessorSymbol("Foo")
            ]);
        });

        it("#elif Foo || true", async () => {
            const input = `#elif Foo || true`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.Hash,
                Token.Keywords.Preprocessor.ElIf,
                Token.Identifiers.PreprocessorSymbol("Foo"),
                Token.Operators.Logical.Or,
                Token.Literals.Boolean.True
            ]);
        });

        it("#elif Foo && true", async () => {
            const input = `#elif Foo && true`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.Hash,
                Token.Keywords.Preprocessor.ElIf,
                Token.Identifiers.PreprocessorSymbol("Foo"),
                Token.Operators.Logical.And,
                Token.Literals.Boolean.True
            ]);
        });

        it("#elif Foo == true", async () => {
            const input = `#elif Foo == true`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.Hash,
                Token.Keywords.Preprocessor.ElIf,
                Token.Identifiers.PreprocessorSymbol("Foo"),
                Token.Operators.Relational.Equals,
                Token.Literals.Boolean.True
            ]);
        });

        it("#elif Foo != true", async () => {
            const input = `#elif Foo != true`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.Hash,
                Token.Keywords.Preprocessor.ElIf,
                Token.Identifiers.PreprocessorSymbol("Foo"),
                Token.Operators.Relational.NotEqual,
                Token.Literals.Boolean.True
            ]);
        });

        it("#elif !Foo", async () => {
            const input = `#elif !Foo`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.Hash,
                Token.Keywords.Preprocessor.ElIf,
                Token.Operators.Logical.Not,
                Token.Identifiers.PreprocessorSymbol("Foo")
            ]);
        });

        it("#elif (Foo != true) && Bar", async () => {
            const input = `#elif (Foo != true) && Bar`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.Hash,
                Token.Keywords.Preprocessor.ElIf,
                Token.Punctuation.OpenParen,
                Token.Identifiers.PreprocessorSymbol("Foo"),
                Token.Operators.Relational.NotEqual,
                Token.Literals.Boolean.True,
                Token.Punctuation.CloseParen,
                Token.Operators.Logical.And,
                Token.Identifiers.PreprocessorSymbol("Bar")
            ]);
        });

        it("#elif (Foo != true) && Bar//Foo", async () => {
            const input = `#elif (Foo != true) && Bar//Foo`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.Hash,
                Token.Keywords.Preprocessor.ElIf,
                Token.Punctuation.OpenParen,
                Token.Identifiers.PreprocessorSymbol("Foo"),
                Token.Operators.Relational.NotEqual,
                Token.Literals.Boolean.True,
                Token.Punctuation.CloseParen,
                Token.Operators.Logical.And,
                Token.Identifiers.PreprocessorSymbol("Bar"),
                Token.Comment.SingleLine.Start,
                Token.Comment.SingleLine.Text("Foo")
            ]);
        });

        it("#elif (Foo != true) && Bar //Foo", async () => {
            const input = `#elif (Foo != true) && Bar //Foo`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.Hash,
                Token.Keywords.Preprocessor.ElIf,
                Token.Punctuation.OpenParen,
                Token.Identifiers.PreprocessorSymbol("Foo"),
                Token.Operators.Relational.NotEqual,
                Token.Literals.Boolean.True,
                Token.Punctuation.CloseParen,
                Token.Operators.Logical.And,
                Token.Identifiers.PreprocessorSymbol("Bar"),
                Token.Comment.SingleLine.Start,
                Token.Comment.SingleLine.Text("Foo")
            ]);
        });

        it("#else", async () => {
            const input = `#else`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.Hash,
                Token.Keywords.Preprocessor.Else,
            ]);
        });

        it("#else//Foo", async () => {
            const input = `#else//Foo`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.Hash,
                Token.Keywords.Preprocessor.Else,
                Token.Comment.SingleLine.Start,
                Token.Comment.SingleLine.Text("Foo")
            ]);
        });

        it("#else //Foo", async () => {
            const input = `#else //Foo`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.Hash,
                Token.Keywords.Preprocessor.Else,
                Token.Comment.SingleLine.Start,
                Token.Comment.SingleLine.Text("Foo")
            ]);
        });

        it("#endif", async () => {
            const input = `#endif`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.Hash,
                Token.Keywords.Preprocessor.EndIf,
            ]);
        });

        it("#endif//Foo", async () => {
            const input = `#endif//Foo`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.Hash,
                Token.Keywords.Preprocessor.EndIf,
                Token.Comment.SingleLine.Start,
                Token.Comment.SingleLine.Text("Foo")
            ]);
        });

        it("#endif //Foo", async () => {
            const input = `#endif //Foo`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.Hash,
                Token.Keywords.Preprocessor.EndIf,
                Token.Comment.SingleLine.Start,
                Token.Comment.SingleLine.Text("Foo")
            ]);
        });

        it("#warning This is a warning", async () => {
            const input = `#warning This is a warning`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.Hash,
                Token.Keywords.Preprocessor.Warning,
                Token.PreprocessorMessage("This is a warning")
            ]);
        });

        it("#error This is an error", async () => {
            const input = `#error This is an error`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.Hash,
                Token.Keywords.Preprocessor.Error,
                Token.PreprocessorMessage("This is an error")
            ]);
        });

        it("#region My Region", async () => {
            const input = `#region My Region`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.Hash,
                Token.Keywords.Preprocessor.Region,
                Token.PreprocessorMessage("My Region")
            ]);
        });

        it("#region \"My Region\"", async () => {
            const input = `#region "My Region"`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.Hash,
                Token.Keywords.Preprocessor.Region,
                Token.PreprocessorMessage("\"My Region\"")
            ]);
        });

        it("#endregion", async () => {
            const input = `#endregion`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.Hash,
                Token.Keywords.Preprocessor.EndRegion
            ]);
        });

        it("#endregion//Foo", async () => {
            const input = `#endregion//Foo`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.Hash,
                Token.Keywords.Preprocessor.EndRegion,
                Token.Comment.SingleLine.Start,
                Token.Comment.SingleLine.Text("Foo")
            ]);
        });

        it("#endregion //Foo", async () => {
            const input = `#endregion //Foo`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.Hash,
                Token.Keywords.Preprocessor.EndRegion,
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
                Token.Keywords.Modifiers.Public,
                Token.Keywords.Enum,
                Token.Identifiers.EnumName("E"),
                Token.Punctuation.OpenBrace,
                Token.Identifiers.EnumMemberName("A"),
                Token.Punctuation.Comma,
                Token.Identifiers.EnumMemberName("B"),
                Token.Operators.Assignment,
                Token.Variables.ReadWrite("A"),
                Token.Punctuation.Comma,
                Token.Identifiers.EnumMemberName("C"),
                Token.Operators.Assignment,
                Token.Literals.Numeric.Decimal("2"),
                Token.Operators.Arithmetic.Addition,
                Token.Variables.ReadWrite("A"),
                Token.Punctuation.Comma,

                Token.Punctuation.Hash,
                Token.Keywords.Preprocessor.If,
                Token.Identifiers.PreprocessorSymbol("DEBUG"),
                Token.Identifiers.EnumMemberName("D"),
                Token.Punctuation.Comma,
                Token.Punctuation.Hash,
                Token.Keywords.Preprocessor.EndIf,

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
                Token.Keywords.Preprocessor.Region,
                Token.PreprocessorMessage("\" Register / Create New  \""),
                Token.Comment.SingleLine.Start,
                Token.Comment.SingleLine.Text(" GET: /Account/Register"),
                Token.Punctuation.OpenBracket,
                Token.Type("Authorize"),
                Token.Punctuation.OpenParen,
                Token.Identifiers.PropertyName("Roles"),
                Token.Operators.Assignment,
                Token.Variables.Object("UserRoles"),
                Token.Punctuation.Accessor,
                Token.Variables.Property("SuperUser"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.CloseBracket,
                Token.Keywords.Modifiers.Public,
                Token.Type("ActionResult"),
                Token.Identifiers.MethodName("Register"),
                Token.Punctuation.OpenParen,
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Identifiers.MethodName("RedirectToAction"),
                Token.Punctuation.OpenParen,
                Token.Punctuation.String.Begin,
                Token.Literals.String("Application"),
                Token.Punctuation.String.End,
                Token.Punctuation.CloseParen,
                Token.Punctuation.Semicolon,
                Token.Keywords.Control.Return,
                Token.Identifiers.MethodName("View"),
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
                Token.Keywords.Preprocessor.If,
                Token.Operators.Logical.Not,
                Token.Identifiers.PreprocessorSymbol("PCL"),
                Token.Punctuation.OpenBracket,
                Token.Type("Serializable"),
                Token.Punctuation.CloseBracket,
                Token.Punctuation.Hash,
                Token.Keywords.Preprocessor.EndIf,
                Token.Keywords.Modifiers.Public,
                Token.Keywords.Struct,
                Token.Identifiers.StructName("Interval"),
                Token.Punctuation.Colon,
                Token.Type("IEquatable"),
                Token.Punctuation.TypeParameters.Begin,
                Token.Type("Interval"),
                Token.Punctuation.TypeParameters.End,
                Token.Punctuation.Comma,
                Token.Type("IXmlSerializable"),
                Token.Punctuation.Hash,
                Token.Keywords.Preprocessor.If,
                Token.Operators.Logical.Not,
                Token.Identifiers.PreprocessorSymbol("PCL"),
                Token.Punctuation.Comma,
                Token.Type("ISerializable"),
                Token.Punctuation.Hash,
                Token.Keywords.Preprocessor.EndIf,
            ]);
        });

        it("#load", async () => {
            const input = "#load";
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.Hash,
                Token.Keywords.Preprocessor.Load
            ]);
        });

        it(`#load "foo.csx"`, async () => {
            const input = `#load "foo.csx"`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.Hash,
                Token.Keywords.Preprocessor.Load,
                Token.Literals.String(`"foo.csx"`)
            ]);
        });

        it("#r", async () => {
            const input = "#r";
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.Hash,
                Token.Keywords.Preprocessor.R
            ]);
        });

        it(`#r "System.Net.dll"`, async () => {
            const input = `#r "System.Net.dll"`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.Hash,
                Token.Keywords.Preprocessor.R,
                Token.Literals.String(`"System.Net.dll"`)
            ]);
        });
    });
});
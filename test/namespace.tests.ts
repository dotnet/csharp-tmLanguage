/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { should } from 'chai';
import { tokenize, Token } from './utils/tokenize';

describe("Namespace", () => {
    before(() => { should(); });

    describe("Block-Scoped Namespace", () => {
        it("has a namespace keyword and a name", async () => {

            const input = `
namespace TestNamespace
{
}`;
            let tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Definition.Namespace,
                Token.Identifier.NamespaceName("TestNamespace"),
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace]);
        });

        it("has a namespace keyword and a dotted name", async () => {

            const input = `
namespace Test.Namespace
{
}`;
            let tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Definition.Namespace,
                Token.Identifier.NamespaceName("Test"),
                Token.Punctuation.Accessor,
                Token.Identifier.NamespaceName("Namespace"),
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace]);
        });

        it("can be nested", async () => {

            const input = `
namespace TestNamespace
{
    namespace NestedNamespace {

    }
}`;
            let tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Definition.Namespace,
                Token.Identifier.NamespaceName("TestNamespace"),
                Token.Punctuation.OpenBrace,

                Token.Keyword.Definition.Namespace,
                Token.Identifier.NamespaceName("NestedNamespace"),
                Token.Punctuation.OpenBrace,

                Token.Punctuation.CloseBrace,
                Token.Punctuation.CloseBrace]);
        });

        it("can contain using statements", async () => {

            const input = `
using UsingOne;
using one = UsingOne.Something;

namespace TestNamespace
{
    using UsingTwo;
    using two = UsingTwo.Something;

    namespace NestedNamespace
    {
        using UsingThree;
        using three = UsingThree.Something;
    }
}`;
            let tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Directive.Using,
                Token.Identifier.NamespaceName("UsingOne"),
                Token.Punctuation.Semicolon,

                Token.Keyword.Directive.Using,
                Token.Identifier.AliasName("one"),
                Token.Operator.Assignment,
                Token.Type("UsingOne"),
                Token.Punctuation.Accessor,
                Token.Type("Something"),
                Token.Punctuation.Semicolon,

                Token.Keyword.Definition.Namespace,
                Token.Identifier.NamespaceName("TestNamespace"),
                Token.Punctuation.OpenBrace,

                Token.Keyword.Directive.Using,
                Token.Identifier.NamespaceName("UsingTwo"),
                Token.Punctuation.Semicolon,

                Token.Keyword.Directive.Using,
                Token.Identifier.AliasName("two"),
                Token.Operator.Assignment,
                Token.Type("UsingTwo"),
                Token.Punctuation.Accessor,
                Token.Type("Something"),
                Token.Punctuation.Semicolon,

                Token.Keyword.Definition.Namespace,
                Token.Identifier.NamespaceName("NestedNamespace"),
                Token.Punctuation.OpenBrace,

                Token.Keyword.Directive.Using,
                Token.Identifier.NamespaceName("UsingThree"),
                Token.Punctuation.Semicolon,

                Token.Keyword.Directive.Using,
                Token.Identifier.AliasName("three"),
                Token.Operator.Assignment,
                Token.Type("UsingThree"),
                Token.Punctuation.Accessor,
                Token.Type("Something"),
                Token.Punctuation.Semicolon,

                Token.Punctuation.CloseBrace,
                Token.Punctuation.CloseBrace]);
        });
    });

    describe("File-Scoped Namespace", () => {
        it("has a namespace keyword and a name", async () => {

            const input = `
namespace TestNamespace;`;
            let tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Definition.Namespace,
                Token.Identifier.NamespaceName("TestNamespace"),
                Token.Punctuation.Semicolon]);
        });

        it("has a namespace keyword and a dotted name", async () => {

            const input = `
namespace Test.Namespace;`;
            let tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Definition.Namespace,
                Token.Identifier.NamespaceName("Test"),
                Token.Punctuation.Accessor,
                Token.Identifier.NamespaceName("Namespace"),
                Token.Punctuation.Semicolon]);
        });
    });
});
# Tinybox

Tinybox is a Node.js application that helps you manage things in your home.

This project is still in very early stage of development, looking for contributers! You can try out an early build at [app.tinybox.cloud](https://app.tinybox.cloud)

![2022-02-28 18 02 37](https://user-images.githubusercontent.com/7855724/156072934-c5e06cee-43db-40d6-bd8a-fbdc62d9c465.gif)

## Running tests

Tinybox uses Jest as the test runner. It is preferred that you use Nx commands
to run tests.

To run all tests (this can be slow):

```bash
$ nx run-many --all --target=test --parallel
```

To run all tests for a specific package (for example `assertion`):

```bash
$ nx test assertion
```

If you use Visual Studio Code, [Jest Runner](https://marketplace.visualstudio.com/items?itemName=firsttris.vscode-jest-runner) is a great extension to speed up your development.

## Built With

- [Nx](https://nx.dev/) - Monorepo management system
- [TypeScript](https://www.typescriptlang.org/) - Language of choice
- [MongoDB](https://www.mongodb.com/) - DBMS

## Contributing

Please read [CONTRIBUTING.md](https://github.com/junzhengca/tinybox/blob/main/CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags).

## Authors

See the list of [contributors](https://github.com/junzhengca/tinybox/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

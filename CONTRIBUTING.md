# Contributing

## self-service-reasons

### Developing

First clone this repository and create a new branch from master where you're going to make all the changes.

#### Add Translations

To add a new language file you'll only need to find the lastest version and add the desired file to the version folder.

#### Fix Translations

To fix any messages you'll need to copy the whole version folder along with its messages and rename it as the next version (folowing [Semantic Versioning](https://semver.org/)). Then, make the desired changes in the new version folder.

### Release

Currently, we use [Releasy](https://github.com/vtex/releasy) to deploy. Once you're finished with your changes and your PR has already been approved by at least 2 developers, you may run `releasy [minor/patch] --stable`. After that, you should merge the branch to master.

If you've added a new folder, remember to change the version where this resource is being used to the new folder name. For exemple: [Portal-ui](https://github.com/vtex/portal-ui/blob/623ea98f401dca17ae165ec9d00cad27941502bb/src/script/services/sac-service.coffee#L14)

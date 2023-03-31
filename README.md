# MinecraftModManager

## Project goals

- [x] mod searching
- [x] mod download
- [ ] keep track of the downloaded mods
- [ ] mod updater

## Commands to implement

- execute `<path>`
- config
- update `<version>`

## JSON script schema

```js
{
    'gameVersion': string,
    'modList': [{
        'modId': int,
        'fileName': string
    }]
    'modPath': string
}
```

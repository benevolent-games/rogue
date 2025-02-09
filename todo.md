
```
s/

	app/ -- everything outside the 3d game world (2d interfaces, menus, homepage, etc)
		features/
			accounts/
				avatars/
				client/
				server/
			characters/
				server/
				client/
			security/
		icons/
		api.ts
		context.ts
		theme.css.ts

	dev/
		supercontrol/

	game/ -- everything inside the 3d game world (entities, logic, rendering, etc)
		commons/
		dungeons/
		entities/
		flows/
		physics/
		realm/
		station/

	packs/ -- standalone projects that might be extracted into separate repos
		archimedes/
		grip/
		logistics/
		math/
			shapes/
			phys2/
			optimize/
				hash-set.ts
				hash-map.ts
				mapvec2.ts

	tools/ -- box of handy tools that are generic, too small to be separate repos

	constants.ts
	main.bundle.ts
	main.css
	index.html
	starter.ts
	tests.test.ts
```


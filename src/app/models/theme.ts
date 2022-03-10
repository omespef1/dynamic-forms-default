export class Theme {
    id: string;
    code = '';
    name = '';
    assets: ThemeAssets = new ThemeAssets();
}

export class ThemeAssets {
    primaryColor = '#ffffff';
    primaryTextColor = '#ffffff';
    secundaryColor = '#ffffff';
    secundaryTextColor = '#ffffff';
    titleColor = '#ffffff';
    titleTextColor: '#ffffff';
    subTitleColor = '#ffffff';
    labelColor = '#ffffff';
    gridHeaderColor = '#ffffff';
    gridHeaderTextColor = '#ffffff';
    primaryButtonColor = '#ffffff';
    primaryButtonTextColor = '#ffffff';
    secundaryButtonColor = '#ffffff';
    secundaryButtonTextColor = '#ffffff';
}

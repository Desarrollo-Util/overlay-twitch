export enum HeroTypes {
	FOLLOW,
	SUBSCRIPTION,
	CHEER,
}

export type HeroInfoState = Partial<Record<HeroTypes, string>>;

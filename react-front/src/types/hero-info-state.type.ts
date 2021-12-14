export enum HeroTypes {
	FOLLOW,
	SUBSCRIPTION,
	BITS,
}

export type HeroInfoState = Partial<Record<HeroTypes, string>>;

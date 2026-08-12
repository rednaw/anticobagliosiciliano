export type ArchivioImage = {
	id: string;
	filename: string;
	title: string;
	thumb: string;
	full: string;
	width: number;
	height: number;
	bytes: number;
};

export type ArchivioText = {
	id: string;
	title: string;
	filename: string;
	body: string;
};

export type ArchivioGroup = {
	id: string;
	label: string;
	images: ArchivioImage[];
	texts: ArchivioText[];
};

export type ArchivioSource = {
	id: string;
	label: string;
	url: string;
	groups: ArchivioGroup[];
};

export type ArchivioIndex = {
	generatedAt: string;
	repo: string;
	branch: string;
	note: string;
	sources: ArchivioSource[];
};

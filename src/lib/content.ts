import fs from 'fs/promises';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'content.json');

export interface HeroContent {
    title: string;
    subtitle: string;
    ctaText: string;
    ctaLink: string;
    backgroundImage: string;
}

export interface Service {
    id: string;
    title: string;
    description: string;
    icon: string;
}

export interface TeamMember {
    id: string;
    name: string;
    role: string;
    bio: string;
}

export interface GalleryItem {
    id: string;
    type: 'image' | 'video';
    src: string;
    videoSrc?: string;
    title: string;
    category: string;
    description: string;
}

export interface ContentData {
    hero: HeroContent;
    services: Service[];
    team: TeamMember[];
    clients: string[];
    gallery: GalleryItem[];
}

// Read content from JSON file
export async function getContent(): Promise<ContentData> {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading content file:', error);
        throw new Error('Failed to load content');
    }
}

// Write content to JSON file
export async function saveContent(content: ContentData): Promise<void> {
    try {
        await fs.writeFile(DATA_FILE, JSON.stringify(content, null, 2), 'utf-8');
    } catch (error) {
        console.error('Error saving content file:', error);
        throw new Error('Failed to save content');
    }
}

// Get specific section
export async function getHero(): Promise<HeroContent> {
    const content = await getContent();
    return content.hero;
}

export async function getServices(): Promise<Service[]> {
    const content = await getContent();
    return content.services;
}

export async function getTeam(): Promise<TeamMember[]> {
    const content = await getContent();
    return content.team;
}

export async function getClients(): Promise<string[]> {
    const content = await getContent();
    return content.clients;
}

export async function getGallery(): Promise<GalleryItem[]> {
    const content = await getContent();
    return content.gallery;
}

// Update specific section
export async function updateHero(hero: HeroContent): Promise<void> {
    const content = await getContent();
    content.hero = hero;
    await saveContent(content);
}

export async function updateServices(services: Service[]): Promise<void> {
    const content = await getContent();
    content.services = services;
    await saveContent(content);
}

export async function updateTeam(team: TeamMember[]): Promise<void> {
    const content = await getContent();
    content.team = team;
    await saveContent(content);
}

export async function updateClients(clients: string[]): Promise<void> {
    const content = await getContent();
    content.clients = clients;
    await saveContent(content);
}

export async function updateGallery(gallery: GalleryItem[]): Promise<void> {
    const content = await getContent();
    content.gallery = gallery;
    await saveContent(content);
}

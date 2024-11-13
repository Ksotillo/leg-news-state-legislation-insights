import { supabase } from './supabase';

interface ArticleInput {
	title: string;
	description: string;
	category: string;
	state: string;
	content: string;
	authorId: number;
	imageFile?: File;
}

export async function createArticle(article: ArticleInput) {
	try {
		let imageUrl = null;

		// Upload image if provided
		if (article.imageFile) {
            // Generate a unique filename
            const timestamp = Date.now();
            const fileExt = article.imageFile.name.split(".").pop();
            const fileName = `${timestamp}-${Math.random().toString(36).substring(7)}.${fileExt}`;
            const filePath = `articles/${fileName}`;

               // Convert File to ArrayBuffer
            const arrayBuffer = await article.imageFile.arrayBuffer();
            const buffer = new Uint8Array(arrayBuffer);
            console.log(filePath, buffer, article.imageFile.type);
            const { error: uploadError } = await supabase.storage.from("images").upload(filePath, buffer, {
                contentType: article.imageFile.type,
                cacheControl: "3600",
                upsert: false,
            });

            if (uploadError) {
            console.error("Image upload error:", uploadError);
            throw uploadError;
            }

			// Get public URL for the uploaded image
			const { data: { publicUrl } } = supabase.storage
				.from('images')
				.getPublicUrl(fileName);

			imageUrl = publicUrl;
		}

		// Create article in database
		const { data, error } = await supabase
			.from('article')
			.insert([
				{
					title: article.title,
					description: article.description,
					category: article.category,
					state: article.state,
					content: article.content,
					urlToImage: imageUrl,
					author: article.authorId,
				}
			])
			.select()
			.single();

		if (error) throw error;
		return data;
	} catch (error) {
		console.error('Error creating article:', error);
		throw error;
	}
}
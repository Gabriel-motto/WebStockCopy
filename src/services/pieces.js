import { useImageName } from "@/hooks/usePieces";
import supabase from "../utils/supabase";

export async function getPieces(workshop, search, multiple, column, orderBy) {
    let query = supabase.from("pieces_new").select(column);

    if (workshop !== "all") {
        query = query.eq("workshop", workshop);
    }

    if (multiple.length !== 0) {
        query = query.in("name", multiple);
    }

    if (search) {
        query = query.or(
            `name.ilike.%${search}%,description.ilike.%${search}%`
        );
    }

    if (orderBy) {
        query = query.order(orderBy.column, { ascending: orderBy.ascending });
    }

    const { data: pieces } = await query;

    return pieces;
}

export async function getTotalStockPiece(pieceId, column) {
    let query = supabase
        .from("v_stock_total")
        .select(column)
        .eq("piece_id", pieceId);

    return await query;
}

export async function getMachinesStockPiece(pieceId, column) {
    let query = supabase
        .from("v_stock_machines")
        .select(column)
        .eq("piece_id", pieceId);

    return await query;
}

export async function getWarehousesStockPiece(pieceId, column) {
    let query = supabase
        .from("v_stock_warehouses")
        .select(column)
        .eq("piece_id", pieceId);

    return await query;
}

export async function insertPiece(newPiece) {

    const { data: piece, error } = await supabase
        .from("pieces_new")
        .insert([
            {
                name: newPiece.name.toUpperCase(),
                brand: newPiece.brand.toUpperCase(),
                type: newPiece.type.toUpperCase(),
                description: newPiece.description,
                is_critical: newPiece.isCritical,
                workshop: newPiece.workshop,
                buy_price: newPiece.buyPrice,
                repair_price: newPiece.repairPrice,
                supplier: newPiece.supplier.toUpperCase(),
                alternative_piece: newPiece.altPiece,
                additional_info: newPiece.additionalInfo,
                availability: newPiece.availability,
                min_stock: newPiece.minStock,
            },
        ])
        .select("id")
        .throwOnError();

    insertImage("pieces", newPiece.pieceImage);
    insertImage("pieces", newPiece.dataCard);
    insertImage("pieces", newPiece.additionalImage);
}

export async function getImageName(bucket, baseName, limit = 1) {
    if (baseName.includes("/")) {
        baseName = baseName.replaceAll("/", "_");
    }

    const query = supabase.storage.from(bucket).list("", {
        limit: limit,
        offset: 0,
        sortBy: { column: "name", order: "desc" },
        search: baseName,
    });

    const { data: image } = await query;

    return image;
}

export async function insertImage(bucket, image) {
    if (image.path.includes("/")) {
        image.path = image.path.replaceAll("/", "_");
    }

    const { error: uploadImageError } = await supabase.storage
        .from(bucket)
        .upload(image.path, image.file, {
            cacheControl: "3600",
            upsert: true,
            contentType: image.file.type,
        });
}

export async function deleteImage({ bucket, path }) {
    const { error: removeError } = await supabase.storage
        .from(bucket)
        .remove([path]);
}

export async function insertRecentMovement({ values, pieceId }) {
    if (values.action === "new") {
        const { error } = await supabase
            .from("piece_actions_new")
            .insert([
                {
                    piece: pieceId,
                    action: values.action,
                    amount: values.amount,
                },
            ])
            .throwOnError();
    }
    if (values.action === "install") {
        const { error } = await supabase
            .from("piece_actions_new")
            .insert([
                {
                    piece: pieceId,
                    machine_to: values.locationTo,
                    action: values.action,
                },
            ])
            .throwOnError();
    }
    if (values.action === "stocked") {
        const { error } = await supabase
            .from("piece_actions_new")
            .insert([
                {
                    piece: pieceId,
                    warehouse_to: values.locationTo,
                    action: values.action,
                },
            ])
            .throwOnError();
    }
    if (values.action === "delete") {
    }
    if (values.action === "repair_in") {
        const { error } = await supabase
            .from("piece_actions_new")
            .insert([
                {
                    piece: pieceId,
                    location_1: values.location,
                    action: values.action,
                    amount: values.amount,
                },
            ])
            .throwOnError();
    }
    if (values.action === "repair_out") {
    }
}

export async function updatePiece(updatedPiece, pieceImageOld, dataCardOld, additionalImageOld) {
    const { data, error } = await supabase
        .from("pieces_new")
        .update({
            brand: updatedPiece.brand?.toUpperCase(),
            type: updatedPiece.type?.toUpperCase(),
            workshop: updatedPiece.workshop,
            availability: updatedPiece.availability,
            buy_price: updatedPiece.buyPrice,
            repair_price: updatedPiece.repairPrice,
            min_stock: updatedPiece.minStock,
            supplier: updatedPiece.supplier?.toUpperCase(),
            alternative_piece: updatedPiece.altPiece,
            is_critical: updatedPiece.is_critical,
            description: updatedPiece.description,
            additional_info: updatedPiece.additionalInfo,
        })
        .eq("id", updatedPiece.id)
        .throwOnError();

    if (updatedPiece.pieceImage.file !== null) {
        deleteImage("pieces", pieceImageOld);
        insertImage("pieces", updatedPiece.pieceImage);
    }

    if (updatedPiece.dataCard.file !== null) {
        deleteImage("pieces", dataCardOld);
        insertImage("pieces", updatedPiece.dataCard);
    }

    if (updatedPiece.additionalImage.file !== null) {
        deleteImage("pieces", additionalImageOld);
        insertImage("pieces", updatedPiece.additionalImage);
    }
}

export async function getPieceTypes(search = "") {
    const query = supabase
        .from("v_piece_types")
        .select()
        .order("type", { ascending: true })
        .throwOnError();
        
    if(search) {
        query.ilike("name", `%${search}%`);
    }

    const { data: types, error } = await query;

    return types;
}

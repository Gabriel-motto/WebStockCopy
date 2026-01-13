import { useMachines } from "@/hooks/useMachines";
import { useWarehouse } from "@/hooks/useWarehouse";
import supabase from "@/utils/supabase";

export async function getPieceSerials(pieceId, search, column, id) {
    let query = supabase.from("piece_serials").select(column);

    if (id) {
        query = query.eq("id", id);
    }

    if (pieceId) {
        query = query.eq("piece_id", pieceId);
    }

    if (search) {
        query = query.ilike("serial_code", `%${search}%`);
    }

    const { data: pieceSerials } = await query;

    return pieceSerials;
}

export async function insertPieceSerials(values, location, isMachine) {
    const insertData = isMachine
        ? {
              piece_id: values.pieceId,
              status: "active",
              current_machine: location,
              current_warehouse: null,
          }
        : {
              piece_id: values.pieceId,
              status: "inactive",
              current_warehouse: location,
              current_machine: null,
          };

    const { data: pieceSerial, error: insertError } = await supabase
        .from("piece_serials")
        .insert(insertData)
        .select("id")
        .throwOnError();

    return pieceSerial;
}

export async function updatePieceSerialsService(values, location, isMachine) {
    const updateData = isMachine
        ? {
              status: "active",
              current_machine: location,
              current_warehouse: null,
          }
        : {
              status: "inactive",
              current_warehouse: location,
              current_machine: null,
          };

    const { data: pieceSerial, error: updateError } = await supabase
        .from("piece_serials")
        .update(updateData)
        .eq("serial_code", values.serial)
        .throwOnError();
    console.log("Updating piece serial with data:", updateData);
}

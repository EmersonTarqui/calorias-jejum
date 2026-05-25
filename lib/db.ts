import { db, auth } from "@/lib/firebase";
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  deleteDoc, 
  doc,       
  updateDoc,
  orderBy,
  Timestamp 
} from "firebase/firestore";

export type Refeicao = {
  id?: string;
  userId?: string;
  descricao: string;
  calorias: number;
  tipoRefeicao: "café" | "almoço" | "lanche" | "jantar" | "ceia";
  dataHora: Date | Timestamp; 
};

// funcao para salvar documento associado ao id do usuario autenticado
export async function salvarRefeicao(refeicao: Omit<Refeicao, "userId">) {
  const user = auth.currentUser;
  if (!user) throw new Error("Usuário não autenticado");

  return await addDoc(collection(db, "refeicoes"), {
    ...refeicao,
    userId: user.uid,
    dataHora: refeicao.dataHora instanceof Date 
      ? Timestamp.fromDate(refeicao.dataHora) 
      : refeicao.dataHora
  });
}

// recupera e ordena os documentos baseados na query executada
export async function listarRefeicoes(userId: string) {
  const q = query(
    collection(db, "refeicoes"), 
    where("userId", "==", userId),
    orderBy("dataHora", "desc")
  );
  
  // snapshot contem o estado atual dos documentos retornados pela query do firestore
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      dataHora: data.dataHora?.toDate() 
    } as Refeicao;
  });
}

// obtem a referencia do documento e atualiza as propriedades declaradas
export async function atualizarRefeicao(id: string, dadosAtualizados: any) {
  const referencia = doc(db, "refeicoes", id);
  await updateDoc(referencia, dadosAtualizados);
}

// remove o registro da base de dados localizando pelo id
export async function deletarRefeicao(id: string) {
  await deleteDoc(doc(db, "refeicoes", id));
}
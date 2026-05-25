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
  getDoc,
  setDoc,
  orderBy,
  Timestamp,
  limit
} from "firebase/firestore";

export type Refeicao = {
  id?: string;
  userId?: string;
  descricao: string;
  calorias: number;
  tipoRefeicao: "café" | "almoço" | "lanche" | "jantar" | "ceia";
  dataHora: Date | Timestamp; 
};

// tipo jejum para registrar no bd
export type Jejum = {
  id?: string;
  userId: string;
  tipo: string;
  inicio: Timestamp;
  fim: Timestamp | null;
};

/* REFEICAO */

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
export async function listarRefeicoes(userId: string):Promise<Refeicao[]>  {
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
export async function atualizarRefeicao(id: string, dadosAtualizados: Partial<Refeicao>) {
  const referencia = doc(db, "refeicoes", id);
  await updateDoc(referencia, dadosAtualizados);
}

// remove o registro da base de dados localizando pelo id
export async function deletarRefeicao(id: string) {
  await deleteDoc(doc(db, "refeicoes", id));
}

/* META-DIARIA */

// busca a meta diária do usuário ou retorna 2000 como padrão
export async function buscarMeta(userId: string): Promise<number> {
  const docRef = doc(db, "usuarios", userId);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return docSnap.data().metaDiaria || 2000;
  }
  return 2000;
}

export async function salvarMeta(userId: string, meta: number) {
  const docRef = doc(db, "usuarios", userId);
  await setDoc(docRef, { metaDiaria: meta }, { merge: true });
}


/* JEJUM */

// cria registro de novo jejum com status ativo (fim nulo)
export async function iniciarJejum(userId: string, tipo: string) {
  return await addDoc(collection(db, "jejuns"), {
    userId,
    tipo,
    inicio: Timestamp.now(),
    fim: null
  });
}

// busca o jejum ativo e mapeia explicitamente para o tipo Jejum
export async function buscarJejumAtivo(userId: string): Promise<Jejum | null> {
  const q = query(
    collection(db, "jejuns"),
    where("userId", "==", userId),
    where("fim", "==", null),
    limit(1)
  );
  
  const snapshot = await getDocs(q);
  
  if (snapshot.docs.length === 0) return null;

  const docData = snapshot.docs[0];
  const data = docData.data();

  return {
    id: docData.id,
    userId: data.userId,
    tipo: data.tipo,
    inicio: data.inicio,
    fim: data.fim
  } as Jejum;
}

// encerra o jejum ativo atualizando o campo fim com a hora atual
export async function encerrarJejum(id: string) {
  await updateDoc(doc(db, "jejuns", id), {
    fim: Timestamp.now()
  });
}

// lista todos os registros de jejuns finalizados do usuario
export async function listarJejuns(userId: string): Promise<Jejum[]> {
  const q = query(
    collection(db, "jejuns"),
    where("userId", "==", userId),
    where("fim", "!=", null),
    orderBy("fim", "desc")
  );
  
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Jejum));
}
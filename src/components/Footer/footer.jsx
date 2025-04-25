import React from 'react';
import S from './footer.module.scss';


export default function footer(){
    return(
    <>
        <footer>
            <div className={S.container}>
                <p>&copy; 2025 - Todos os direitos reservados</p>
                <p>Desenvolvido por: Adriano Agra</p>
            </div>
            
            <div className={S.versao}>
                <p>Versão 1.0.0</p>
            </div>
        </footer>
                
    </>
    )
}
<template>
    <Content>
        <template v-slot:left>
            <p>Leftiii</p>
        </template>
        <template>
            <Container> 
                <template v-slot:header>
                    <span>Aufbau</span>
                </template>
                <template v-slot:image>
                    <img class="grad-header__logo" src="@/assets/image.jpg">
                </template>
                <template>
                    Wir freuen uns immer über neue Gastspieler, die bereits Erfahrung mit ArmA3 haben und über Grundkenntnisse der wichtigsten Mods wie ACE und TFAR verfügen. Wir spielen regelmäßig montags und freitags, zusätzlich kann aber auch an anderen Tagen ein Spiel stattfinden. Sprich uns einfach an, wenn du interessiert bist und die Voraussetzungen erfüllst.
                </template>
            </Container>
            <Container headerColor="#66AA66"> 
                <template v-slot:header>
                    <span>Gastspieler</span>
                </template>
                <template>
                    Du darfst an den meisten unserer Spiele teilnehmen. Du hast keine Pflichten in der Gruppe, aber auch kein Stimmrecht.
                </template>
                <template v-slot:footer>
                    Im Forum vorstellen, TS-Gespräch führen, Nickname festlegen
                </template>
            </Container>
            <Container headerColor="#66AA66"> 
                <template v-slot:header>
                    <span>Stammspieler</span>
                </template>
                <template>
                    Wir ernennen Dich zum Stammspieler. Bei Inaktivität kann Dir der Stammspieler-Status wieder entzogen werden.
                </template>
                <template v-slot:footer>
                    Regelmäßig dabei sein.
                </template>
            </Container>
            <Container headerColor="#6CAACC"> 
                <template v-slot:header>
                    <span>Anwärter</span>
                </template>
                <template>
                    Wenn du mehr willst, bewirb dich um die Mitgliedschaft. Nutze die Anwärterzeit, um die Adler von dir zu überzeugen.
                </template>
                <template v-slot:footer>
                    Als Anwärter melden, Im Forum bewerben, Adler überzeugen
                </template>
            </Container>
            <Container headerColor="#D18D1F"> 
                <template v-slot:header>
                    <span>Adler</span>
                </template>
                <template>
                    Wir ernennen Dich zum Stammspieler. Bei Inaktivität kann Dir der Stammspieler-Status wieder entzogen werden.
                </template>
                <template v-slot:footer>
                    Zugang zu Interna in Discord, Forum, Wiki, Stimmrecht
                </template>
            </Container>
        </template>
    </Content>
</template>
</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Struktur extends Vue {}
</script>


<?php
/**
 * Plugin Name: MoziMotors Core (Headless)
 * Description: Voitures, témoignages, demandes (leads) et réglages pour le site Next.js MoziMotors. Expose l'API REST mozi/v1.
 * Version:     1.2.0
 * Author:      MoziMotors
 * Text Domain: mozimotors
 * Requires PHP: 7.4
 */

if (!defined('ABSPATH')) exit;

define('MOZI_VERSION', '1.2.0');

/* -------------------------------------------------------------------------
 * Field definitions (single source of truth for admin UI + REST output)
 * ---------------------------------------------------------------------- */
function mozi_car_fields() {
    return [
        'model'        => ['label' => 'Modèle', 'type' => 'text', 'req' => true, 'ph' => '3008'],
        'version'      => ['label' => 'Version / finition', 'type' => 'text', 'ph' => '1.5 BlueHDi 130 EAT8 Allure'],
        'year'         => ['label' => 'Année', 'type' => 'number', 'req' => true],
        'mileage'      => ['label' => 'Kilométrage (km)', 'type' => 'number', 'req' => true],
        'price'        => ['label' => 'Prix (DH)', 'type' => 'number', 'req' => true],
        'old_price'    => ['label' => 'Ancien prix (DH) — affiche une baisse', 'type' => 'number'],
        'fuel'         => ['label' => 'Carburant', 'type' => 'select', 'options' => ['essence' => 'Essence', 'diesel' => 'Diesel', 'hybride' => 'Hybride', 'electrique' => 'Électrique']],
        'gearbox'      => ['label' => 'Boîte', 'type' => 'select', 'options' => ['automatique' => 'Automatique', 'manuelle' => 'Manuelle']],
        'body_type'    => ['label' => 'Carrosserie', 'type' => 'select', 'options' => ['suv' => 'SUV', 'berline' => 'Berline', 'break' => 'Break', 'citadine' => 'Citadine', 'compacte' => 'Compacte', 'monospace' => 'Monospace', 'coupe' => 'Coupé', 'cabriolet' => 'Cabriolet', 'pickup' => 'Pick-up', 'utilitaire' => 'Utilitaire']],
        'city'         => ['label' => 'Ville', 'type' => 'text', 'ph' => 'Casablanca'],
        'fiscal_power' => ['label' => 'Puissance fiscale (CV)', 'type' => 'number'],
        'doors'        => ['label' => 'Portes', 'type' => 'number'],
        'seats'        => ['label' => 'Places', 'type' => 'number'],
        'cylinders'    => ['label' => 'Cylindres', 'type' => 'number'],
        'drivetrain'   => ['label' => 'Transmission', 'type' => 'select', 'options' => ['' => '—', '2WD' => '2 roues motrices', '4WD' => '4x4 / AWD', 'RWD' => 'Propulsion']],
        'owners'       => ['label' => 'Nombre de mains', 'type' => 'number'],
        'origin'       => ['label' => 'Origine', 'type' => 'text', 'ph' => 'WW Maroc / Importée'],
        'condition'    => ['label' => 'État général', 'type' => 'select', 'options' => ['Comme neuf' => 'Comme neuf', 'Excellent état' => 'Excellent état', 'Très bon état' => 'Très bon état', 'Bon état' => 'Bon état', 'État correct' => 'État correct']],
        'imperfections'=> ['label' => 'Imperfections signalées', 'type' => 'number'],
        'report_url'   => ['label' => 'Lien rapport d\'expertise (PDF)', 'type' => 'url'],
        'negotiable'   => ['label' => 'Prix négociable', 'type' => 'bool'],
        'certified'    => ['label' => 'Certifiée (inspectée)', 'type' => 'bool', 'default' => 1],
        'financeable'  => ['label' => 'Finançable', 'type' => 'bool', 'default' => 1],
        'private_seller'=> ['label' => 'Vendeur particulier', 'type' => 'bool'],
        'no_defects'   => ['label' => 'Sans imperfection', 'type' => 'bool'],
        'featured'     => ['label' => 'Mise en avant (accueil)', 'type' => 'bool'],
        'sold'         => ['label' => 'Vendue (masquée du site)', 'type' => 'bool'],
        'feat_multimedia' => ['label' => 'Équipements multimédia (1 par ligne)', 'type' => 'lines'],
        'feat_confort'    => ['label' => 'Équipements confort (1 par ligne)', 'type' => 'lines'],
        'feat_securite'   => ['label' => 'Équipements sécurité (1 par ligne)', 'type' => 'lines'],
        'feat_exterieur'  => ['label' => 'Équipements extérieur (1 par ligne)', 'type' => 'lines'],
    ];
}

/* -------------------------------------------------------------------------
 * Post types & taxonomy
 * ---------------------------------------------------------------------- */
add_action('init', function () {
    register_post_type('voiture', [
        'labels' => [
            'name' => 'Voitures', 'singular_name' => 'Voiture', 'add_new' => 'Ajouter une voiture',
            'add_new_item' => 'Ajouter une voiture', 'edit_item' => 'Modifier la voiture', 'all_items' => 'Toutes les voitures',
        ],
        'public' => false, 'show_ui' => true, 'show_in_rest' => false,
        'menu_icon' => 'dashicons-car', 'menu_position' => 5,
        'supports' => ['title', 'editor', 'thumbnail'],
    ]);

    register_taxonomy('marque', 'voiture', [
        'labels' => ['name' => 'Marques', 'singular_name' => 'Marque', 'add_new_item' => 'Ajouter une marque'],
        'public' => false, 'show_ui' => true, 'show_admin_column' => true, 'hierarchical' => true,
        'meta_box_cb' => 'post_categories_meta_box',
    ]);

    register_post_type('temoignage', [
        'labels' => ['name' => 'Témoignages', 'singular_name' => 'Témoignage', 'add_new_item' => 'Ajouter un témoignage'],
        'public' => false, 'show_ui' => true, 'menu_icon' => 'dashicons-format-quote', 'menu_position' => 6,
        'supports' => ['title', 'editor', 'excerpt', 'thumbnail'],
    ]);

    register_post_type('demande', [
        'labels' => ['name' => 'Demandes', 'singular_name' => 'Demande', 'all_items' => 'Toutes les demandes'],
        'public' => false, 'show_ui' => true, 'menu_icon' => 'dashicons-email-alt', 'menu_position' => 4,
        'supports' => ['title'], 'capabilities' => ['create_posts' => 'do_not_allow'], 'map_meta_cap' => true,
    ]);
});

/* -------------------------------------------------------------------------
 * Admin: car meta box (fields + gallery)
 * ---------------------------------------------------------------------- */
add_action('add_meta_boxes', function () {
    add_meta_box('mozi_car', 'Détails du véhicule', 'mozi_car_metabox', 'voiture', 'normal', 'high');
    add_meta_box('mozi_gallery', 'Galerie photos', 'mozi_gallery_metabox', 'voiture', 'normal', 'high');
    add_meta_box('mozi_testi', 'Détails', 'mozi_testi_metabox', 'temoignage', 'side');
    add_meta_box('mozi_lead', 'Détails de la demande', 'mozi_lead_metabox', 'demande', 'normal', 'high');
});

function mozi_car_metabox($post) {
    wp_nonce_field('mozi_save', 'mozi_nonce');
    echo '<style>.mozi-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:12px 16px}.mozi-grid label{font-weight:600;display:block;margin-bottom:4px}.mozi-grid input[type=text],.mozi-grid input[type=number],.mozi-grid input[type=url],.mozi-grid select,.mozi-grid textarea{width:100%}.mozi-wide{grid-column:1/-1}.mozi-lines{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:12px 16px;margin-top:16px}</style>';
    echo '<p style="color:#666">La <strong>marque</strong> se choisit dans la boîte « Marques » à droite. Le titre sert uniquement en interne (ex : « Peugeot 3008 2022 Casablanca »). Le texte principal = description.</p>';
    $fields = mozi_car_fields();
    echo '<div class="mozi-grid">';
    foreach ($fields as $key => $f) {
        if ($f['type'] === 'lines') continue;
        $val = get_post_meta($post->ID, "_mozi_$key", true);
        if ($val === '' && isset($f['default']) && $post->post_status === 'auto-draft') $val = $f['default'];
        $req = !empty($f['req']) ? ' required' : '';
        echo '<div>';
        if ($f['type'] === 'bool') {
            printf('<label><input type="checkbox" name="mozi[%s]" value="1" %s> %s</label>', esc_attr($key), checked((string) $val, '1', false), esc_html($f['label']));
        } else {
            printf('<label for="mozi_%1$s">%2$s%3$s</label>', esc_attr($key), esc_html($f['label']), $req ? ' *' : '');
            if ($f['type'] === 'select') {
                printf('<select id="mozi_%s" name="mozi[%s]">', esc_attr($key), esc_attr($key));
                foreach ($f['options'] as $ov => $ol) printf('<option value="%s" %s>%s</option>', esc_attr($ov), selected($val, $ov, false), esc_html($ol));
                echo '</select>';
            } else {
                printf('<input id="mozi_%1$s" type="%2$s" name="mozi[%1$s]" value="%3$s" placeholder="%4$s"%5$s>', esc_attr($key), esc_attr($f['type']), esc_attr($val), esc_attr($f['ph'] ?? ''), $req);
            }
        }
        echo '</div>';
    }
    echo '</div><div class="mozi-lines">';
    foreach ($fields as $key => $f) {
        if ($f['type'] !== 'lines') continue;
        printf('<div><label style="font-weight:600;display:block;margin-bottom:4px">%s</label><textarea name="mozi[%s]" rows="5" style="width:100%%">%s</textarea></div>',
            esc_html($f['label']), esc_attr($key), esc_textarea(get_post_meta($post->ID, "_mozi_$key", true)));
    }
    echo '</div>';
}

/** Photo categories shown as tabs above the gallery on the car page. */
function mozi_photo_categories() {
    return [
        'exterieur'       => 'Extérieur',
        'interieur'       => 'Intérieur',
        'moteur'          => 'Moteur',
        'tableau-de-bord' => 'Tableau de bord',
        'pneus'           => 'Pneus',
        'imperfections'   => 'Imperfections',
    ];
}

/** Attachment id → category, defaulting to « Extérieur ». */
function mozi_gallery_cats($post_id) {
    $cats = json_decode((string) get_post_meta($post_id, '_mozi_gallery_cats', true), true);
    return is_array($cats) ? $cats : [];
}

function mozi_gallery_cat_select($id, $current) {
    $html = '<select class="mozi-cat" data-id="' . (int) $id . '" style="display:block;width:110px;margin-top:4px;font-size:11px;min-height:24px;padding:0 4px">';
    foreach (mozi_photo_categories() as $k => $l) {
        $html .= sprintf('<option value="%s" %s>%s</option>', esc_attr($k), selected($current, $k, false), esc_html($l));
    }
    return $html . '</select>';
}

function mozi_gallery_metabox($post) {
    $ids = array_filter(array_map('intval', explode(',', (string) get_post_meta($post->ID, '_mozi_gallery', true))));
    $cats = mozi_gallery_cats($post->ID);
    echo '<p style="color:#666">La première photo est utilisée comme image principale. Glissez pour réordonner. Choisissez la catégorie de chaque photo : elle détermine l\'onglet (Extérieur, Intérieur, Moteur…) sur la fiche voiture.</p>';
    echo '<ul id="mozi-gallery" style="display:flex;flex-wrap:wrap;gap:8px;margin:0">';
    foreach ($ids as $id) {
        printf('<li data-id="%d" style="position:relative;cursor:move">%s<a href="#" class="mozi-rm" style="position:absolute;top:2px;right:4px;color:#b32d2e;text-decoration:none;font-weight:700">×</a>%s</li>',
            $id, wp_get_attachment_image($id, [110, 80], false, ['style' => 'display:block;width:110px;height:80px;object-fit:cover;border-radius:6px']),
            mozi_gallery_cat_select($id, $cats[$id] ?? 'exterieur'));
    }
    echo '</ul>';
    printf('<input type="hidden" id="mozi-gallery-input" name="mozi_gallery" value="%s">', esc_attr(implode(',', $ids)));
    printf('<input type="hidden" id="mozi-gallery-cats" name="mozi_gallery_cats" value="%s">', esc_attr(wp_json_encode((object) $cats)));
    echo '<p><button type="button" class="button button-primary" id="mozi-gallery-add">Ajouter des photos</button></p>';
    // Template used by the JS when photos are added from the media library.
    printf('<template id="mozi-cat-template">%s</template>', mozi_gallery_cat_select(0, 'exterieur'));
}

add_action('admin_enqueue_scripts', function ($hook) {
    $screen = get_current_screen();
    if (!$screen || $screen->post_type !== 'voiture') return;
    wp_enqueue_media();
    wp_enqueue_script('jquery-ui-sortable');
    wp_add_inline_script('jquery-ui-sortable', <<<'JS'
jQuery(function($){
  var $list=$('#mozi-gallery'), $input=$('#mozi-gallery-input'), $cats=$('#mozi-gallery-cats');
  function sync(){
    var ids=[], cats={};
    $list.children().each(function(){ var id=$(this).data('id'); ids.push(id); cats[id]=$(this).find('.mozi-cat').val()||'exterieur'; });
    $input.val(ids.join(',')); $cats.val(JSON.stringify(cats));
  }
  $list.sortable({update:sync, cancel:'select'});
  $list.on('change','.mozi-cat',sync);
  $list.on('click','.mozi-rm',function(e){e.preventDefault();$(this).parent().remove();sync();});
  $('#mozi-gallery-add').on('click',function(e){
    e.preventDefault();
    var frame=wp.media({title:'Photos du véhicule',multiple:'add',library:{type:'image'},button:{text:'Ajouter'}});
    frame.on('select',function(){
      var tpl=$('#mozi-cat-template').html();
      frame.state().get('selection').each(function(a){
        a=a.toJSON(); var url=(a.sizes&&a.sizes.thumbnail?a.sizes.thumbnail.url:a.url);
        $list.append('<li data-id="'+a.id+'" style="position:relative;cursor:move"><img src="'+url+'" style="display:block;width:110px;height:80px;object-fit:cover;border-radius:6px"><a href="#" class="mozi-rm" style="position:absolute;top:2px;right:4px;color:#b32d2e;text-decoration:none;font-weight:700">×</a>'+tpl+'</li>');
      });
      sync();
    });
    frame.open();
  });
});
JS);
});

function mozi_testi_metabox($post) {
    wp_nonce_field('mozi_save', 'mozi_nonce');
    $city = get_post_meta($post->ID, '_mozi_city', true);
    $rating = get_post_meta($post->ID, '_mozi_rating', true) ?: 5;
    echo '<p style="color:#666">Titre = nom du client. Contenu = avis. Extrait (optionnel) = titre court de l'avis. Image mise en avant (optionnelle) = photo du client.</p>';
    printf('<p><label>Ville<br><input type="text" name="mozi[city]" value="%s" style="width:100%%"></label></p>', esc_attr($city));
    printf('<p><label>Note (1-5)<br><input type="number" min="1" max="5" name="mozi[rating]" value="%d"></label></p>', (int) $rating);
}

function mozi_lead_metabox($post) {
    $data = get_post_meta($post->ID, '_mozi_lead', true);
    if (!is_array($data)) { echo '<p>Aucune donnée.</p>'; return; }
    echo '<table class="widefat striped"><tbody>';
    foreach ($data as $k => $v) printf('<tr><th style="width:200px">%s</th><td>%s</td></tr>', esc_html($k), nl2br(esc_html($v)));
    echo '</tbody></table>';
    $phone = preg_replace('/\D/', '', $data['phone'] ?? '');
    if ($phone) {
        $wa = strpos($phone, '0') === 0 ? '212' . substr($phone, 1) : $phone;
        printf('<p style="margin-top:12px"><a class="button button-primary" href="tel:%1$s">Appeler</a> <a class="button" target="_blank" href="https://wa.me/%2$s">WhatsApp</a></p>', esc_attr($phone), esc_attr($wa));
    }
    $status = get_post_meta($post->ID, '_mozi_status', true) ?: 'nouveau';
    wp_nonce_field('mozi_save', 'mozi_nonce');
    echo '<p><label><strong>Statut : </strong><select name="mozi[status]">';
    foreach (['nouveau' => 'Nouveau', 'en_cours' => 'En cours', 'traite' => 'Traité', 'perdu' => 'Perdu'] as $k => $l) printf('<option value="%s" %s>%s</option>', $k, selected($status, $k, false), $l);
    echo '</select></label></p>';
}

add_action('save_post', function ($post_id, $post) {
    if (!isset($_POST['mozi_nonce']) || !wp_verify_nonce($_POST['mozi_nonce'], 'mozi_save')) return;
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
    if (!current_user_can('edit_post', $post_id)) return;
    $in = isset($_POST['mozi']) && is_array($_POST['mozi']) ? wp_unslash($_POST['mozi']) : [];

    if ($post->post_type === 'voiture') {
        foreach (mozi_car_fields() as $key => $f) {
            $v = $in[$key] ?? '';
            switch ($f['type']) {
                case 'bool':   $v = empty($v) ? '0' : '1'; break;
                case 'number': $v = $v === '' ? '' : (string) floatval($v); break;
                case 'url':    $v = esc_url_raw($v); break;
                case 'lines':  $v = sanitize_textarea_field($v); break;
                default:       $v = sanitize_text_field($v);
            }
            update_post_meta($post_id, "_mozi_$key", $v);
        }
        $ids = array_filter(array_map('intval', explode(',', sanitize_text_field($_POST['mozi_gallery'] ?? ''))));
        update_post_meta($post_id, '_mozi_gallery', implode(',', $ids));
        $raw_cats = json_decode(wp_unslash($_POST['mozi_gallery_cats'] ?? ''), true);
        $valid = mozi_photo_categories();
        $cats = [];
        foreach ($ids as $id) {
            $c = is_array($raw_cats) ? sanitize_key($raw_cats[$id] ?? '') : '';
            $cats[$id] = isset($valid[$c]) ? $c : 'exterieur';
        }
        update_post_meta($post_id, '_mozi_gallery_cats', wp_json_encode((object) $cats));
        if ($ids && !has_post_thumbnail($post_id)) set_post_thumbnail($post_id, $ids[0]);
    } elseif ($post->post_type === 'temoignage') {
        update_post_meta($post_id, '_mozi_city', sanitize_text_field($in['city'] ?? ''));
        update_post_meta($post_id, '_mozi_rating', max(1, min(5, (int) ($in['rating'] ?? 5))));
    } elseif ($post->post_type === 'demande') {
        update_post_meta($post_id, '_mozi_status', sanitize_key($in['status'] ?? 'nouveau'));
    }
}, 10, 2);

/* Admin list columns */
add_filter('manage_voiture_posts_columns', function ($c) {
    return array_slice($c, 0, 2) + ['mozi_price' => 'Prix', 'mozi_year' => 'Année', 'mozi_km' => 'Km', 'mozi_city' => 'Ville', 'mozi_flags' => 'Statut'] + $c;
});
add_action('manage_voiture_posts_custom_column', function ($col, $id) {
    $m = fn($k) => get_post_meta($id, "_mozi_$k", true);
    if ($col === 'mozi_price') echo esc_html(number_format_i18n((float) $m('price'))) . ' DH';
    if ($col === 'mozi_year') echo esc_html($m('year'));
    if ($col === 'mozi_km') echo esc_html(number_format_i18n((float) $m('mileage')));
    if ($col === 'mozi_city') echo esc_html($m('city'));
    if ($col === 'mozi_flags') echo $m('sold') === '1' ? '<strong style="color:#b32d2e">Vendue</strong>' : ($m('featured') === '1' ? '★ En avant' : 'En ligne');
}, 10, 2);
add_filter('manage_demande_posts_columns', fn($c) => ['cb' => $c['cb'], 'title' => 'Demande', 'mozi_type' => 'Type', 'mozi_phone' => 'Téléphone', 'mozi_status' => 'Statut', 'date' => 'Date']);
add_action('manage_demande_posts_custom_column', function ($col, $id) {
    $d = get_post_meta($id, '_mozi_lead', true) ?: [];
    if ($col === 'mozi_type') echo esc_html(ucfirst($d['type'] ?? ''));
    if ($col === 'mozi_phone') echo esc_html($d['phone'] ?? '');
    if ($col === 'mozi_status') echo esc_html(get_post_meta($id, '_mozi_status', true) ?: 'nouveau');
}, 10, 2);

/* -------------------------------------------------------------------------
 * Settings page
 * ---------------------------------------------------------------------- */
function mozi_setting_fields() {
    return [
        'phone'        => ['Téléphone affiché', '+212 5 00 00 00 00'],
        'whatsapp'     => ['Numéro WhatsApp (format international, chiffres)', '212600000000'],
        'email'        => ['Email de contact', 'contact@mozimotors.ma'],
        'address'      => ['Adresse du showroom', 'Showroom MoziMotors, Casablanca'],
        'maps_url'     => ['Lien Google Maps', ''],
        'hours'        => ['Horaires', 'Lun – Sam · 9h00 – 19h00'],
        'showroom_city'=> ['Ville du showroom (inspection au showroom)', 'Casablanca'],
        'home_cities'  => ['Villes avec inspection à domicile (séparées par des virgules)', 'Casablanca, Rabat, Mohammadia'],
        'instagram'    => ['URL Instagram', ''],
        'facebook'     => ['URL Facebook', ''],
        'loan_rate'    => ['Taux crédit indicatif (%)', '6.9'],
        'loan_months'  => ['Durée crédit par défaut (mois)', '60'],
        'lead_email'   => ['Email qui reçoit les demandes', ''],
        'frontend_url' => ['URL du site Next.js (pour la mise à jour instantanée)', 'https://www.mozimotors.ma'],
        'secret'       => ['Clé secrète partagée (= WP_SHARED_SECRET côté Next.js)', ''],
    ];
}

add_action('admin_menu', function () {
    add_options_page('MoziMotors', 'MoziMotors', 'manage_options', 'mozimotors', function () {
        echo '<div class="wrap"><h1>Réglages MoziMotors</h1><form method="post" action="options.php">';
        settings_fields('mozimotors');
        $opt = get_option('mozi_settings', []);
        echo '<table class="form-table">';
        foreach (mozi_setting_fields() as $k => [$label, $ph]) {
            $type = $k === 'secret' ? 'password' : 'text';
            printf('<tr><th><label for="mozi_%1$s">%2$s</label></th><td><input class="regular-text" type="%5$s" id="mozi_%1$s" name="mozi_settings[%1$s]" value="%3$s" placeholder="%4$s" autocomplete="off"></td></tr>',
                esc_attr($k), esc_html($label), esc_attr($opt[$k] ?? ''), esc_attr($ph), $type);
        }
        echo '</table>';
        submit_button();
        echo '</form></div>';
    });
});
add_action('admin_init', function () {
    register_setting('mozimotors', 'mozi_settings', [
        'type' => 'array',
        'sanitize_callback' => fn($v) => is_array($v) ? array_map('sanitize_text_field', $v) : [],
    ]);
});

function mozi_opt($key, $default = '') {
    $o = get_option('mozi_settings', []);
    return isset($o[$key]) && $o[$key] !== '' ? $o[$key] : $default;
}

/* -------------------------------------------------------------------------
 * « Textes du site » — the client edits the site's wording (FR / EN / AR)
 * without touching code. texts-catalog.json lists every editable string with
 * its original text; edits are stored as overrides in the `mozi_texts` option
 * ({ lang: { "hero.title": "…" } }) and served by GET /texts.
 * An empty field means "keep the original text".
 * ---------------------------------------------------------------------- */
function mozi_texts_catalog() {
    static $cat = null;
    if ($cat === null) {
        $file = __DIR__ . '/texts-catalog.json';
        $cat = is_readable($file) ? json_decode((string) file_get_contents($file), true) : [];
        if (!is_array($cat)) $cat = [];
    }
    return $cat;
}

function mozi_text_langs() {
    return ['fr' => 'Français', 'en' => 'English', 'ar' => 'العربية'];
}

/** Sections in the order shown in the admin, with friendly names. Unknown sections are listed last. */
function mozi_text_sections() {
    return [
        'hero' => 'Accueil — bandeau principal', 'bodyCarousel' => 'Accueil — carrosseries', 'featured' => 'Accueil — voitures à la une',
        'brands' => 'Accueil — marques', 'banners' => 'Accueil — bannières acheter / vendre', 'how' => 'Comment ça marche',
        'financeTeaser' => 'Accueil — financement', 'financeWidget' => 'Simulateur de budget', 'trust' => 'Accueil — confiance',
        'stats' => 'Chiffres clés', 'reviews' => 'Avis clients (titres)', 'visit' => 'Venir au showroom', 'cta' => 'Bannière « Trouvez votre voiture »',
        'faq' => 'FAQ (accueil)', 'faqPage' => 'Page FAQ', 'guides' => 'Guides / conseils', 'why' => 'Page « Pourquoi MoziMotors »',
        'contact' => 'Page Contact', 'sell' => 'Page Vendre', 'sellStart' => 'Vendre — démarrage', 'sellWizard' => "Vendre — formulaire d'estimation",
        'buy' => 'Page Acheter', 'filters' => 'Filtres de recherche', 'car' => 'Fiche voiture', 'carActions' => 'Fiche voiture — réservation / essai',
        'loan' => 'Simulateur de crédit', 'gallery' => 'Galerie photos', 'leadForm' => 'Formulaires (textes communs)',
        'footer' => 'Pied de page', 'nav' => 'Menu de navigation', 'buyMenu' => 'Menu « Acheter »', 'common' => 'Mots communs',
        'vehicle' => 'Libellés véhicule (carburant, boîte…)', 'card' => 'Carte voiture', 'notFound' => 'Page introuvable (404)',
        'whatsappFab' => 'Bouton WhatsApp', 'legal' => 'Mentions légales, CGV, cookies', 'meta' => 'Référencement (titre & description Google)',
    ];
}

function mozi_texts_option() {
    $o = get_option('mozi_texts', []);
    return is_array($o) ? $o : [];
}

add_action('admin_menu', function () {
    add_menu_page('Textes du site', 'Textes du site', 'edit_pages', 'mozi-texts', 'mozi_texts_page', 'dashicons-edit-page', 7);
});

function mozi_texts_url($args = []) {
    return add_query_arg(array_merge(['page' => 'mozi-texts'], $args), admin_url('admin.php'));
}

function mozi_texts_page() {
    if (!current_user_can('edit_pages')) return;
    $langs = mozi_text_langs();
    $lang = isset($_GET['lang'], $langs[$_GET['lang']]) ? $_GET['lang'] : 'fr';
    $catalog = mozi_texts_catalog();
    $labels = mozi_text_sections();
    $overrides = mozi_texts_option()[$lang] ?? [];

    // Group catalog by top-level section, keeping the labelled order.
    $groups = [];
    foreach ($catalog as $row) $groups[explode('.', $row['k'])[0]][] = $row;
    $ordered = [];
    foreach (array_keys($labels) as $sec) if (isset($groups[$sec])) $ordered[$sec] = $groups[$sec];
    foreach ($groups as $sec => $rows) if (!isset($ordered[$sec])) $ordered[$sec] = $rows;
    $section = isset($_GET['section'], $ordered[$_GET['section']]) ? $_GET['section'] : (array_key_first($ordered) ?: '');

    echo '<div class="wrap"><h1>Textes du site</h1>';
    if (!$catalog) { echo '<div class="notice notice-error"><p>Le fichier texts-catalog.json est introuvable dans le plugin.</p></div></div>'; return; }
    if (isset($_GET['updated'])) echo '<div class="notice notice-success is-dismissible"><p>Textes enregistrés. Le site est mis à jour.</p></div>';
    echo '<p style="max-width:760px;color:#555">Modifiez ici les textes affichés sur le site, langue par langue. <strong>Laissez un champ vide pour garder le texte d\'origine</strong> (affiché en gris). Conservez les codes entre accolades comme <code>{n}</code> : ils sont remplacés automatiquement.</p>';

    echo '<h2 class="nav-tab-wrapper">';
    foreach ($langs as $code => $name) {
        printf('<a class="nav-tab %s" href="%s">%s</a>', $code === $lang ? 'nav-tab-active' : '', esc_url(mozi_texts_url(['lang' => $code, 'section' => $section])), esc_html($name));
    }
    echo '</h2>';

    echo '<div style="display:flex;gap:24px;align-items:flex-start;margin-top:16px">';
    echo '<ul style="flex:0 0 270px;margin:0;background:#fff;border:1px solid #c3c4c7;border-radius:6px;padding:6px 0">';
    foreach ($ordered as $sec => $rows) {
        $edited = 0;
        foreach ($rows as $r) if (!empty($overrides[$r['k']])) $edited++;
        printf('<li style="margin:0"><a href="%s" style="display:block;padding:7px 14px;text-decoration:none;%s">%s%s</a></li>',
            esc_url(mozi_texts_url(['lang' => $lang, 'section' => $sec])),
            $sec === $section ? 'background:#f0f0f1;font-weight:600;border-left:3px solid #2271b1' : 'border-left:3px solid transparent',
            esc_html($labels[$sec] ?? $sec),
            $edited ? ' <span style="background:#2271b1;color:#fff;border-radius:9px;padding:0 7px;font-size:11px">' . $edited . '</span>' : '');
    }
    echo '</ul><div style="flex:1;min-width:0">';

    printf('<form method="post" action="%s">', esc_url(admin_url('admin-post.php')));
    echo '<input type="hidden" name="action" value="mozi_save_texts">';
    wp_nonce_field('mozi_texts', 'mozi_texts_nonce');
    printf('<input type="hidden" name="lang" value="%s"><input type="hidden" name="section" value="%s">', esc_attr($lang), esc_attr($section));
    printf('<h2 style="margin-top:0">%s <small style="color:#777;font-weight:400">— %s</small></h2>', esc_html($labels[$section] ?? $section), esc_html($langs[$lang]));
    $dir = $lang === 'ar' ? 'rtl' : 'ltr';
    echo '<table class="widefat striped" style="table-layout:fixed"><tbody>';
    foreach ($ordered[$section] ?? [] as $r) {
        $def = (string) ($r[$lang] ?? '');
        $val = $overrides[$r['k']] ?? '';
        $rows = max(2, min(8, (int) ceil(mb_strlen($def) / 70)));
        printf('<tr><td style="width:26%%;vertical-align:top"><code style="font-size:11px;word-break:break-all;color:#777">%s</code></td><td>', esc_html($r['k']));
        printf('<textarea name="t[%1$s]" rows="%2$d" dir="%3$s" style="width:100%%;%4$s" placeholder="%5$s">%6$s</textarea>',
            esc_attr($r['k']), $rows, $dir, $val !== '' ? 'border-left:3px solid #2271b1' : '', esc_attr($def), esc_textarea($val));
        echo '</td></tr>';
    }
    echo '</tbody></table>';
    submit_button('Enregistrer cette section');
    echo '</form></div></div></div>';
}

add_action('admin_post_mozi_save_texts', function () {
    if (!current_user_can('edit_pages') || !isset($_POST['mozi_texts_nonce']) || !wp_verify_nonce($_POST['mozi_texts_nonce'], 'mozi_texts')) wp_die('Accès refusé.');
    $langs = mozi_text_langs();
    $lang = isset($_POST['lang'], $langs[$_POST['lang']]) ? $_POST['lang'] : 'fr';
    $section = sanitize_text_field(wp_unslash($_POST['section'] ?? ''));
    $in = isset($_POST['t']) && is_array($_POST['t']) ? wp_unslash($_POST['t']) : [];

    $all = mozi_texts_option();
    $mine = $all[$lang] ?? [];
    foreach (mozi_texts_catalog() as $r) {
        if (explode('.', $r['k'])[0] !== $section) continue;   // only this section is on screen
        $v = isset($in[$r['k']]) && is_string($in[$r['k']]) ? trim(sanitize_textarea_field($in[$r['k']])) : '';
        if ($v === '' || $v === trim((string) ($r[$lang] ?? ''))) unset($mine[$r['k']]);
        else $mine[$r['k']] = mb_substr($v, 0, 5000);
    }
    if ($mine) $all[$lang] = $mine; else unset($all[$lang]);
    update_option('mozi_texts', $all, false);
    wp_safe_redirect(mozi_texts_url(['lang' => $lang, 'section' => $section, 'updated' => 1]));
    exit;
});

/* -------------------------------------------------------------------------
 * REST API  —  /wp-json/mozi/v1/*
 * ---------------------------------------------------------------------- */
function mozi_img_url($id, $size = 'large') {
    $src = wp_get_attachment_image_src($id, $size);
    return $src ? $src[0] : null;
}

function mozi_lines($s) {
    return array_values(array_filter(array_map('trim', preg_split('/\r?\n/', (string) $s))));
}

function mozi_format_car(WP_Post $p) {
    $m = fn($k) => get_post_meta($p->ID, "_mozi_$k", true);
    $n = fn($k) => $m($k) === '' ? null : 0 + $m($k);
    $b = fn($k) => $m($k) === '1';

    $terms = get_the_terms($p->ID, 'marque');
    $brand = ($terms && !is_wp_error($terms)) ? $terms[0] : null;

    $ids = array_filter(array_map('intval', explode(',', (string) $m('gallery'))));
    if (!$ids && has_post_thumbnail($p)) $ids = [get_post_thumbnail_id($p)];
    $cats = mozi_gallery_cats($p->ID);
    $photos = [];
    foreach ($ids as $id) {
        $url = mozi_img_url($id, 'large');
        if ($url) $photos[] = ['url' => $url, 'category' => $cats[$id] ?? 'exterieur'];
    }
    $images = array_column($photos, 'url');

    $car = [
        'id' => $p->ID,
        'slug' => $p->post_name,
        'brand' => $brand ? html_entity_decode($brand->name) : '',
        'brandSlug' => $brand ? $brand->slug : '',
        'model' => $m('model'),
        'version' => $m('version'),
        'year' => (int) $m('year'),
        'mileage' => (int) $m('mileage'),
        'fuel' => $m('fuel') ?: 'diesel',
        'gearbox' => $m('gearbox') ?: 'manuelle',
        'bodyType' => $m('body_type') ?: 'berline',
        'city' => $m('city'),
        'price' => (int) $m('price'),
        'oldPrice' => $n('old_price'),
        'fiscalPower' => $n('fiscal_power'),
        'doors' => $n('doors'),
        'seats' => $n('seats'),
        'cylinders' => $n('cylinders'),
        'drivetrain' => $m('drivetrain') ?: null,
        'owners' => $n('owners'),
        'origin' => $m('origin') ?: null,
        'negotiable' => $b('negotiable'),
        'condition' => $m('condition') ?: null,
        'imperfections' => $n('imperfections'),
        'certified' => $b('certified'),
        'financeable' => $b('financeable'),
        'privateSeller' => $b('private_seller'),
        'noDefects' => $b('no_defects'),
        'featured' => $b('featured'),
        'images' => $images,
        'photos' => $photos,
        'reportUrl' => $m('report_url') ?: null,
        'description' => wp_strip_all_tags($p->post_content) ?: null,
        'features' => [
            'multimedia' => mozi_lines($m('feat_multimedia')),
            'confort' => mozi_lines($m('feat_confort')),
            'securite' => mozi_lines($m('feat_securite')),
            'exterieur' => mozi_lines($m('feat_exterieur')),
        ],
    ];
    // Drop nulls so the frontend treats them as "not set".
    return array_filter($car, fn($v) => $v !== null);
}

function mozi_query_cars($extra = []) {
    return get_posts(array_merge([
        'post_type' => 'voiture',
        'post_status' => 'publish',
        'posts_per_page' => 500,
        'orderby' => 'date',
        'order' => 'DESC',
        'meta_query' => [
            'relation' => 'OR',
            ['key' => '_mozi_sold', 'compare' => 'NOT EXISTS'],
            ['key' => '_mozi_sold', 'value' => '1', 'compare' => '!='],
        ],
    ], $extra));
}

add_action('rest_api_init', function () {
    $ns = 'mozi/v1';

    register_rest_route($ns, '/cars', [
        'methods' => 'GET',
        'permission_callback' => '__return_true',
        'callback' => fn() => array_map('mozi_format_car', mozi_query_cars()),
    ]);

    register_rest_route($ns, '/cars/(?P<slug>[a-z0-9-]+)', [
        'methods' => 'GET',
        'permission_callback' => '__return_true',
        'callback' => function ($req) {
            $posts = mozi_query_cars(['name' => $req['slug'], 'posts_per_page' => 1]);
            return $posts ? mozi_format_car($posts[0]) : new WP_REST_Response(null, 404);
        },
    ]);

    register_rest_route($ns, '/testimonials', [
        'methods' => 'GET',
        'permission_callback' => '__return_true',
        'callback' => function () {
            $posts = get_posts(['post_type' => 'temoignage', 'post_status' => 'publish', 'posts_per_page' => 50]);
            $items = array_map(fn($p) => [
                'id' => $p->ID,
                'name' => get_the_title($p),
                'city' => get_post_meta($p->ID, '_mozi_city', true),
                'rating' => (int) (get_post_meta($p->ID, '_mozi_rating', true) ?: 5),
                'title' => wp_strip_all_tags($p->post_excerpt) ?: null,
                'text' => wp_strip_all_tags($p->post_content),
                'avatar' => has_post_thumbnail($p) ? mozi_img_url(get_post_thumbnail_id($p), 'thumbnail') : null,
            ], $posts);
            // Drop nulls so the frontend treats title/avatar as "not set".
            return array_map(fn($t) => array_filter($t, fn($v) => $v !== null), $items);
        },
    ]);

    register_rest_route($ns, '/settings', [
        'methods' => 'GET',
        'permission_callback' => '__return_true',
        'callback' => fn() => [
            'phone' => mozi_opt('phone'),
            'whatsapp' => mozi_opt('whatsapp'),
            'email' => mozi_opt('email'),
            'address' => mozi_opt('address'),
            'mapsUrl' => mozi_opt('maps_url'),
            'hours' => mozi_opt('hours'),
            'showroomCity' => mozi_opt('showroom_city'),
            'homeInspectionCities' => array_values(array_filter(array_map('trim', explode(',', mozi_opt('home_cities'))))),
            'instagram' => mozi_opt('instagram'),
            'facebook' => mozi_opt('facebook'),
            'loanRate' => (float) mozi_opt('loan_rate', 6.9),
            'loanMonths' => (int) mozi_opt('loan_months', 60),
        ],
    ]);

    register_rest_route($ns, '/texts', [
        'methods' => 'GET',
        'permission_callback' => '__return_true',
        // Overrides only ({ fr: {key: text}, en: {...}, ar: {...} }); cast to objects so JSON is never [].
        'callback' => fn() => (object) array_map(fn($m) => (object) $m, mozi_texts_option()),
    ]);

    register_rest_route($ns, '/leads', [
        'methods' => 'POST',
        'permission_callback' => function ($req) {
            $secret = mozi_opt('secret');
            return $secret && hash_equals($secret, (string) $req->get_header('x-mozi-secret'));
        },
        'callback' => 'mozi_create_lead',
    ]);
});

function mozi_create_lead(WP_REST_Request $req) {
    $raw = $req->get_json_params();
    if (!is_array($raw)) return new WP_Error('invalid', 'Invalid body', ['status' => 400]);

    $data = [];
    foreach (array_slice($raw, 0, 30, true) as $k => $v) {
        if (!is_scalar($v)) continue;
        $data[sanitize_key($k)] = sanitize_textarea_field(mb_substr((string) $v, 0, 2000));
    }
    if (empty($data['name']) || empty($data['phone'])) return new WP_Error('invalid', 'Missing fields', ['status' => 422]);

    $types = ['reservation' => 'Réservation', 'estimation' => 'Estimation', 'financement' => 'Financement', 'contact' => 'Contact', 'essai' => 'Essai'];
    $label = $types[$data['type'] ?? ''] ?? 'Demande';
    $title = sprintf('%s — %s (%s)', $label, $data['name'], $data['phone']);

    $id = wp_insert_post(['post_type' => 'demande', 'post_status' => 'publish', 'post_title' => $title], true);
    if (is_wp_error($id)) return $id;
    update_post_meta($id, '_mozi_lead', $data);
    update_post_meta($id, '_mozi_status', 'nouveau');

    $to = mozi_opt('lead_email', get_option('admin_email'));
    $body = '';
    foreach ($data as $k => $v) $body .= ucfirst($k) . ' : ' . $v . "\n";
    $body .= "\n" . admin_url("post.php?post=$id&action=edit");
    wp_mail($to, "[MoziMotors] $title", $body);

    return ['ok' => true, 'id' => $id];
}

/* -------------------------------------------------------------------------
 * Instant revalidation of the Next.js site
 * ---------------------------------------------------------------------- */
function mozi_ping_frontend(array $tags) {
    $url = rtrim(mozi_opt('frontend_url'), '/');
    $secret = mozi_opt('secret');
    if (!$url || !$secret) return;
    wp_remote_post("$url/api/revalidate", [
        'blocking' => false,
        'timeout' => 3,
        'headers' => ['Content-Type' => 'application/json', 'X-Mozi-Secret' => $secret],
        'body' => wp_json_encode(['tags' => $tags]),
    ]);
}

add_action('save_post', function ($id, $post) {
    if (wp_is_post_revision($id) || wp_is_post_autosave($id)) return;
    if ($post->post_type === 'voiture') mozi_ping_frontend(['cars', 'car-' . $post->post_name]);
    if ($post->post_type === 'temoignage') mozi_ping_frontend(['testimonials']);
}, 20, 2);
add_action('before_delete_post', function ($id) {
    $t = get_post_type($id);
    if ($t === 'voiture') mozi_ping_frontend(['cars']);
    if ($t === 'temoignage') mozi_ping_frontend(['testimonials']);
});
function mozi_ping_for_post($id) {
    $t = get_post_type($id);
    if ($t === 'voiture') mozi_ping_frontend(['cars']);
    if ($t === 'temoignage') mozi_ping_frontend(['testimonials']);
}
add_action('trashed_post', 'mozi_ping_for_post');
add_action('untrashed_post', 'mozi_ping_for_post');
add_action('update_option_mozi_settings', fn() => mozi_ping_frontend(['settings']));
add_action('update_option_mozi_texts', fn() => mozi_ping_frontend(['texts']));
add_action('add_option_mozi_texts', fn() => mozi_ping_frontend(['texts']));
add_action('add_option_mozi_settings', fn() => mozi_ping_frontend(['settings']));
foreach (['created_marque', 'edited_marque', 'delete_marque'] as $hook) add_action($hook, fn() => mozi_ping_frontend(['cars']));

/* -------------------------------------------------------------------------
 * Headless: WordPress is the back-office only. Once the Next.js URL is set,
 * visitors of the WP public site are sent to the real site.
 * (wp-admin, wp-login, REST API, cron and AJAX are not affected.)
 * ---------------------------------------------------------------------- */
add_action('template_redirect', function () {
    $front = rtrim(mozi_opt('frontend_url'), '/');
    if (!$front || is_admin() || wp_doing_ajax() || wp_doing_cron() || (defined('REST_REQUEST') && REST_REQUEST)) return;
    $host = wp_parse_url($front, PHP_URL_HOST);
    if (!$host || strcasecmp($host, wp_parse_url(home_url(), PHP_URL_HOST) ?: '') === 0) return; // same host: never loop
    wp_redirect($front, 302);
    exit;
});
